export interface Message {
  mid: string;
  sender: any;
  recipient: any;
  content: string;
  role: string;
  conversation_id: string;
}
