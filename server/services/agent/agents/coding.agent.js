import { getModel } from "../config/llmModel.js";

export const codingAgent = async (state) => {
  try {
    const intentLlm = await getModel("intent");
    const llm = await getModel("coding");
    const intentRes = await intentLlm.invoke(`
                You are an intent classifier.

                Return Only one of these values.

                CODE_GENERATION
                CODE_REVIEW
                CODE_EXPLAINATION
                DEBUGGING
                OPTIMIZATION
                CONVERSION
                DOCUMENTATION

                User Request:
                ${state.prompt}
            `);

    const intent = intentRes.content;
    if (intent == "CODE_GENERATION") {
      const prompt = `
              
        
  You are CortexAI Coding Agent.

  Generate the requested project.

  Default stack:
  - HTML
  - CSS
  - JavaScript

  Use React / Next.js / Vue ONLY if explicitly requested.

  Rules:
  - Responsive
  - Modern UI
  - CSS Variables
  - Flexbox/Grid
  - Smooth Scroll
  - Hover Effects
  - Beautiful spacing
  - Single page unless user asks otherwise.

  Images:
  Always use real unsplash images.
  Never use placeholders.


  Return ONLY valid JSON.

  Schema:
  {
    "files": [
      {
        "name": "index.html",
        "content": "..."
      },
      {
        "name": "style.css",
        "content": "..."
      },
      {
        "name": "script.js",
        "content": "..."
      }
    ]
  }

  JSON VALIDITY RULES:
  - Return syntactically valid JSON only.
  - Escape double quotes inside string values as \\".
  - Escape newlines inside string values as \\n.
  - Escape backslashes inside string values as \\\\.
  - Do not include Markdown code fences.
  - Ensure every string and object is properly closed.
  - Do not truncate the response.
  - Put the complete source code inside each file's content string.
  - Do not add trailing commas.

  Output rules:
  - Output must start with {
  - Output must end with }
  - No Markdown
  - No explanation
  - No extra text
  - Never mention intent

  User Request:
  ${state.prompt}


                `;

      const res = await llm.invoke(prompt);

    
      console.log(res)

      const content = JSON.parse(res.content);

      return {
        ...state,
        aiResponse: "Code Generated Successfully",
        artifacts: [
          {
            id: Date.now(),

            type: intent,

            title: state.prompt,

            files: content.files || [],
          },
        ],
      };
    }

    const res = await llm.invoke(`
        The user's request is: ${intent}

        Return Markdown only.

        Never genreate project files.

        Use headings like:

        #Overview

        ## Explaination

        ## Problem

        ## Improvements

        ## Best Practices

         ## Optimized Code (if needed)
         
         User Request:
         ${state.prompt}
        `);
    const data = res.content;
    console.log(data);

    return {
      ...state,
      aiResponse: data,
      artifacts: [],
    };
  } catch (error) {
    console.log(error);
  }
};
