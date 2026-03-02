---
title: "Attack Tree App"
tagline: "AI-powered attack tree generator for threat modeling"
description: "Enter any attacker goal and receive a comprehensive attack tree with relevant vectors, defenses, and risk analysis. 6 pre-built trees work without any API key."
github: "https://github.com/Nancy-Chauhan/attacktree-app"
image: "/projects/attacktree-demo.png"
featured: false
order: 6
techStack:
  - Python
  - FastAPI
  - Groq API
  - Llama 3.1 70B
steps:
  - title: "Enter Goal"
    description: "Enter any attacker goal like 'Steal user credentials' or 'Take down website'. 6 pre-built attack trees work instantly without any API key."
  - title: "AI Generation"
    description: "Groq API with Llama 3.1 70B generates a comprehensive attack tree with vectors, defenses, and OWASP mapping."
  - title: "Export"
    description: "Download trees as Markdown or JSON for integration into security documentation."
---

## Overview

AI-powered attack tree generator for threat modeling. Enter any attacker goal and receive a comprehensive attack tree with relevant vectors, defenses, and risk analysis.

### Default Prompts (No API Key Needed)

| Prompt | Description |
|--------|-------------|
| Steal user credentials | Authentication attacks |
| Access admin dashboard | Authorization bypass |
| Steal payment card data | Financial fraud |
| Take down website | DoS attacks |
| Hack into ATM | ATM security |
| Compromise hospital systems | Healthcare attacks |

Each attack vector includes mitigation strategies and OWASP Top 10 mapping where applicable.
