import type { PromptItem } from '../types';

export const PROMPT_SET: PromptItem[] = [
  {
    id: 'simple-classify',
    label: '1. Simple Classification',
    category: 'simple',
    prompt: 'Classify the following customer feedback as positive, negative, or neutral: "The product arrived on time and works great!"',
    expectedRoutingHint: 'Likely routes to gpt-4.1-mini or nano',
  },
  {
    id: 'short-faq',
    label: '2. Short FAQ Answer',
    category: 'simple',
    prompt: 'What is the capital of France?',
    expectedRoutingHint: 'Likely routes to smallest available model',
  },
  {
    id: 'data-extract',
    label: '3. Data Extraction',
    category: 'simple',
    prompt: `Extract the name, email, and phone number from this text and return as JSON:\n"Please contact John Smith at john.smith@example.com or call 555-123-4567 for more information."`,
    expectedRoutingHint: 'Likely routes to smaller model',
  },
  {
    id: 'summarize',
    label: '4. Summarization',
    category: 'medium',
    prompt: `Summarize the following article in 2-3 sentences:\n\nCloud computing has revolutionized how businesses operate by providing on-demand access to computing resources over the internet. Instead of maintaining expensive physical servers, companies can now rent computing power, storage, and applications from cloud providers like Microsoft Azure, Amazon Web Services, and Google Cloud. This shift has enabled startups to scale rapidly without massive upfront infrastructure investments, while established enterprises have reduced their IT operational costs by migrating workloads to the cloud.`,
    expectedRoutingHint: 'May route to mid-tier model',
  },
  {
    id: 'code-transform',
    label: '5. Code Transform',
    category: 'medium',
    prompt: `Convert this JavaScript function to TypeScript with proper type annotations:\n\nfunction calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n}`,
    expectedRoutingHint: 'Mid-tier model for code understanding',
  },
  {
    id: 'debug-reasoning',
    label: '6. Debug & Reasoning',
    category: 'complex',
    prompt: `Debug this Python code and explain what's wrong:\n\ndef find_average(numbers):\n    total = 0\n    for i in range(len(numbers)):\n        total += numbers[i]\n    return total / len(numbers)\n\n# This crashes with: ZeroDivisionError\nresult = find_average([])\n\nExplain the bug, why it occurs, and provide a corrected version with proper error handling.`,
    expectedRoutingHint: 'Likely routes to larger model',
  },
  {
    id: 'planning-multi',
    label: '7. Multi-Constraint Planning',
    category: 'complex',
    prompt: `Create a 3-day travel itinerary for Tokyo, Japan with these constraints:\n- Budget: $200/day maximum (excluding accommodation)\n- Must include: 1 traditional cultural experience, 1 modern tech district visit, 1 nature spot\n- Dietary restriction: Vegetarian-friendly restaurants only\n- Mobility: Prefer locations accessible by public transit within 30 minutes of Shibuya\n- Time: Visiting in April during cherry blossom season\n\nProvide a day-by-day schedule with estimated costs and transit directions.`,
    expectedRoutingHint: 'Routes to high-capability model',
  },
  {
    id: 'comparative-analysis',
    label: '8. Comparative Analysis',
    category: 'complex',
    prompt: `Compare and contrast microservices architecture vs monolithic architecture for a mid-sized e-commerce platform with 100,000 daily active users. Consider:\n1. Development velocity\n2. Operational complexity\n3. Scalability patterns\n4. Team structure implications\n5. Cost considerations\n\nProvide a recommendation with justification.`,
    expectedRoutingHint: 'Routes to premium model',
  },
  {
    id: 'long-context',
    label: '9. Long-Context Document',
    category: 'long-context',
    prompt: `Analyze the following technical specification and extract all API endpoints, their HTTP methods, required parameters, and expected response formats. Present as a structured table.\n\n---\nTECHNICAL SPECIFICATION: User Management Service v2.1\n\n1. OVERVIEW\nThis service provides comprehensive user management capabilities including registration, authentication, profile management, and role-based access control.\n\n2. ENDPOINTS\n\n2.1 User Registration\nPOST /api/v2/auth/register\nRequired: email (string), password (string), firstName (string), lastName (string)\nOptional: phoneNumber (string), preferredLanguage (string)\nResponse: 201 Created with user object and JWT token\n\n2.2 User Login\nPOST /api/v2/auth/login\nRequired: email (string), password (string)\nOptional: rememberMe (boolean)\nResponse: 200 OK with user object and JWT token\n\n2.3 Get Current User\nGET /api/v2/users/me\nNo parameters required\nResponse: 200 OK with user profile\n\n2.4 Update Profile\nPATCH /api/v2/users/me\nOptional: firstName, lastName, phoneNumber, avatarUrl\nResponse: 200 OK with updated profile\n\n2.5 List Users (Admin)\nGET /api/v2/admin/users\nQuery: page, limit, sortBy, status\nResponse: 200 OK with paginated users\n---`,
    expectedRoutingHint: 'Routes based on context requirements',
  },
  {
    id: 'creative-structured',
    label: '10. Creative + Structured',
    category: 'medium',
    prompt: `Write a professional email template for notifying customers about a scheduled maintenance window. Include subject line, greeting, maintenance details with placeholders, impact explanation, workarounds, contact info, and professional closing. Keep under 200 words.`,
    expectedRoutingHint: 'Mid-tier model',
  },
];
