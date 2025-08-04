export const INVENTORY = (
  items: string[],
  categories: string[],
  conditions: string[],
  prices: number[],
): string => `
[TASK]
Analyze the provided image and associated web page content to identify the item, determine its category, assess its condition, and estimate its resale price. Your goal is to extract a canonical product name, select the most appropriate category, determine the item's condition, and provide a reasoned price estimate based on the information available and the provided price range.

[GUIDELINES]
1. Item Identification:
   - Prioritize the most complete and informative version of the name.
   - Include specific model numbers or versions when consistently present.
   - Retain brand names and product lines.
   - Exclude temporary promotional phrases or irrelevant details.
   - Maintain proper capitalization and spacing.
   - If dealing with a product series, use the most general form unless a specific model is predominant.

2. Category Selection:
   - Analyze the given categories to understand potential applicability in decision support systems or recommendation engines.
   - Predict user preference or optimal choice by analyzing the categories provided.
   - Implement your understanding of nuances between categories to deliver the most accurate prediction.

3. Condition Assessment:
   - Select the single category that best describes the item's condition based on typical criteria and industry standards.
   - Your choice should reflect the most probable condition the item would be classified in a sector-specific context like inventory audits or e-commerce listings.

4. Price Estimation:
   - Consider the item's category and how it typically depreciates.
   - Factor in brand value and its impact on resale prices.
   - Assess how the condition affects the item's desirability and price.
   - Consider the item's age and technological relevance, if applicable.
   - Reflect on market demand and supply for similar items.
   - Use a consistent scale for condition assessment: Poor < Fair < Good < Very Good < Excellent < Like New.
   - Provide prices in whole dollar amounts, rounding to the nearest dollar.
   - Use the provided price range as a guideline, but don't feel constrained by it if your analysis suggests a price outside this range.

[FORMAT]
Use the following format for your response:

[INPUT]
image_description: <Describe the key features and details of the image>
web_content: <Summarize relevant information from the associated web pages>
titles: ${JSON.stringify(items)}
categories: ${JSON.stringify(categories)}
conditions: ${JSON.stringify(conditions)}
prices: ${JSON.stringify(prices)}

[ANALYSIS]
<Provide a step-by-step analysis of the image, web content, given titles, categories, conditions, and prices>

[REASONING]
<Explain your thought process for selecting the final product name, category, condition, and estimated price, referencing the guidelines>

[MARKET CONSIDERATIONS]
<Discuss relevant market factors, trends, or comparable items that influence the price estimation>

[OUTPUT]
name: <The finalized product or service name in 10 words or less>
category: <The best fitting category for the item>
condition: <The best describing condition category for the item's overall state>
price: <Your estimated resale price in USD>
description: <A brief description of the finalized product or service in 10 words or less>

[EXAMPLES]

[Example 1]
[INPUT]
image_description: The image shows a sleek smartphone with a triple-camera setup and an Apple logo on the back.
web_content: The web page describes the latest iPhone 13 Pro, highlighting its features such as the A15 Bionic chip, ProMotion display, and improved camera system.
titles: ["iPhone 13 Pro", "Apple iPhone 13 Pro", "iPhone 13 Pro 256GB"]
categories: ["Phone", "Laptop", "Tablet", "Desktop"]
conditions: ["New", "Like New", "Good", "Fair", "Poor"]
prices: [899, 999, 1099]

[ANALYSIS]
- The image and web content clearly depict an iPhone 13 Pro
- All titles refer to the iPhone 13 Pro, with some variations in detail
- The categories include various electronic devices, with "Phone" being the most relevant
- The conditions range from "New" to "Poor", but the image and description suggest a new product
- The item is a high-end smartphone from a premium brand
- It's the latest model, indicating high market demand and value retention
- The provided price range suggests different storage capacities or promotions

[REASONING]
For the product name, we'll use "Apple iPhone 13 Pro" as it's the most complete name including the brand. We'll select "Phone" as the category since it's the most appropriate for a smartphone. Given that the product is described as the latest model and the image shows a pristine device, we'll choose "New" for the condition. For price estimation, considering it's a new, latest model iPhone from a premium brand, it will command a high price point. The middle price in the range (999) aligns with the typical pricing for a new iPhone Pro model.

[MARKET CONSIDERATIONS]
- iPhones generally hold their value well, especially new models
- High demand for latest Apple products
- Premium pricing strategy of Apple
- The provided price range likely reflects different storage capacities

[OUTPUT]
name: Apple iPhone 13 Pro
category: Phone
condition: New
price: 999
description: High-end smartphone with advanced camera system and powerful processor

Now, analyze the given input and provide your response:

[INPUT]
image_description: <Describe the key features and details of the image>
web_content: <Summarize relevant information from the associated web pages>
titles: ${JSON.stringify(items)}
categories: ${JSON.stringify(categories)}
conditions: ${JSON.stringify(conditions)}
prices: ${JSON.stringify(prices)}
`;
