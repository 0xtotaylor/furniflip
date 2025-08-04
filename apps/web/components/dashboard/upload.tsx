'use client';

import React, { useState, useEffect, useRef } from 'react';
import Uppy from '@uppy/core';
import { debounce } from 'lodash';
import { Dashboard } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import { Uppy as UppyType } from '@uppy/core';
import { isMobile } from 'react-device-detect';
import { Button } from '@/components/ui/button';
import { showToast } from '@/utils/toast-utility';
import { useSupabase } from '@/context/SupabaseProvider';
import { useModal, Modal, ModalContent } from '@/components/ui/modal';

export function Upload() {
  const { closeModal } = useModal();
  const { session } = useSupabase();
  const sessionRef = useRef(session);
  const [fileCount, setFileCount] = useState(0);
  const [uppy, setUppy] = useState<UppyType | null>(null);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxFileSize: 10 * 1024 * 1024,
        maxNumberOfFiles: 20,
        allowedFileTypes: ['image/*']
      },
      allowMultipleUploadBatches: false
    });

    uppyInstance.use(XHRUpload, {
      endpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/core/inventory/create`,
      formData: true,
      fieldName: 'files',
      method: 'POST',
      limit: 1,
      headers: () => ({
        Authorization: `Bearer ${sessionRef.current?.access_token}`
      }),
      timeout: 60000,
      responseType: 'json',
      getResponseData: (xhr) => {
        let parsedResponse;
        try {
          const responseText = xhr.responseText;
          parsedResponse = JSON.parse(responseText);
        } catch (error) {
          parsedResponse = { url: xhr.responseText };
        }
        return parsedResponse;
      }
    });

    if (uppyInstance) {
      uppyInstance.on('upload', () => {
        if (sessionRef.current) {
          const xhrUploadPlugin = uppyInstance.getPlugin('XHRUpload');
          if (xhrUploadPlugin) {
            xhrUploadPlugin.setOptions({
              headers: {
                Authorization: `Bearer ${sessionRef.current.access_token}`
              }
            });
          }
        }
      });

      uppyInstance.on('file-added', () => {
        setFileCount(uppyInstance.getFiles().length);
      });

      uppyInstance.on('file-removed', () => {
        setFileCount(uppyInstance.getFiles().length);
      });
    }

    setUppy(uppyInstance);

    return () => {
      uppyInstance.destroy();
    };
  }, []);

  const handleUpload = () => {
    if (!uppy) return;

    closeModal();

    const uploadPromise = new Promise((resolve, reject) => {
      uppy
        .upload()
        .then((result) => {
          if ((result?.successful ?? []).length > 0) {
            uppy.clear();
            setFileCount(0);
            resolve('Success! Your catalog is ready.');
          } else if ((result?.failed ?? []).length > 0) {
            reject(
              new Error('Failed to upload. You have reached your tier limit.')
            );
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    showToast({
      promise: uploadPromise,
      messages: {
        loading: 'Generating catalog. This takes a few minutes.',
        success: 'Success! Your catalog is ready.',
        error: 'Failed to upload. You have reached your tier limit.'
      },
      theme: 'light'
    });
  };

  const debouncedHandleUpload = debounce(handleUpload, 1000, {
    leading: true,
    trailing: false
  });

  if (!uppy) return null;

  return (
    <Modal title="Upload photos" description="Upload photos">
      <ModalContent>
        <h2 className="text-2xl font-bold text-center mb-2">Upload photos</h2>
        <p className="text-center text-gray-600 mb-4">
          Upload high-quality photos of each item you would like included in
          your catalog
        </p>
        <Dashboard
          uppy={uppy}
          width={isMobile ? '100%' : '900px'}
          height={isMobile ? '300px' : '600px'}
          proudlyDisplayPoweredByUppy={false}
          hideUploadButton={true}
        />
        <Button
          onClick={debouncedHandleUpload}
          className="w-full"
          disabled={fileCount === 0}
        >
          Upload Photos
        </Button>
      </ModalContent>
    </Modal>
  );
}
