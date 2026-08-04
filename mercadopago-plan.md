# MD for: https://www.mercadopago.com.ar/developers/es/docs/mcp-server/overview.md

\# Mercado Pago MCP Server \*\*Mercado Pago MCP Server\*\* implements the open standard \[Model Context Protocol (MCP)\](https://modelcontextprotocol.io) to facilitate access to Mercado Pago APIs and tools for AI agents or LLMs in compatible development environments. This server acts as an intermediary, translating resources from the Mercado Pago ecosystem into executable tools that artificial intelligence applications can invoke to perform actions, extending the traditional capabilities of Mercado Pago APIs to automated or AI-assisted flows. ## What you can do with the MCP Server The MCP Server provides tools that cover the full integration lifecycle, from onboarding to production validation: - Search official Mercado Pago documentation without leaving your development environment. - Manage your applications: create new applications, get credentials, and retrieve information linked to your account. \*\*Available through OAuth only.\*\* - Configure and monitor Webhook notifications. - Create test users and manage their funds to validate payment flows. - Improve your integration quality before going live and run the official Mercado Pago quality measurement. For specific information on each tool and its parameters, see \[Available tools\](https://www.mercadopago.com.ar/developers/en/docs/mcp-server/tools). ## Prerequisites Before you start using the server, make sure you have your environment ready: | Requirement | Description | |-|-| | \*\*Client\*\* | The connection to Mercado Pago MCP Server is remote, so you need to choose a client from which to interact with the assistant. The solution is available for the main AI agents: Cursor (version 1 or higher), VS Code, Windsurf, Cline, Claude Desktop or Code, and ChatGPT. In all cases, make sure you have the latest available version. |

# MD for: https://www.mercadopago.com.ar/developers/es/docs/mcp-server/connection.md

\# Connect to MCP Server The connection to Mercado Pago MCP Server is done remotely through the client that best suits your integration. Check the step-by-step guide below according to the client type. ::::TabsComponent :::TabComponent{title="Cursor"} To install our MCP in Cursor, you can click the button below or follow the steps manually. \[!\[Install MCP Server\](https://cursor.com/deeplink/mcp-install-dark.svg)\](cursor://anysphere.cursor-deeplink/mcp/install?name=mcp-mercadopago-prod-oauth&config=eyJ1cmwiOiJodHRwczovL21jcC5tZXJjYWRvcGFnby5jb20vbWNwIn0%3D) Open the \`.cursor/mcp.json\` file and add the Mercado Pago server configuration as shown below. \`\`\`json { "mcpServers": { "mercadopago-mcp-server": { "url": "https://mcp.mercadopago.com/mcp" } } } \`\`\` Then, go to \*\*Cursor Settings > Tools & MCPs\*\* and enable Mercado Pago MCP Server by clicking \*\*Connect\*\*. !\[Cursor Tools & MCP\](https://http2.mlstatic.com/storage/dx-devsite/docs-assets/custom-upload/2025/11/5/1764949890252-cursormcp.png) > WARNING > > If Cursor does not initiate the connection when clicking the indicated button, use the \*\*Needs authentication\*\* link, located below the MCP name. When enabling the connection, you will be redirected to the Mercado Pago website for authentication, where you must indicate which \*\*country\*\* you are operating from and, if you agree with the permissions granted, \*\*authorize the connection\*\*. Once these steps are completed, you will automatically return to Cursor and the connection to Mercado Pago MCP Server will be ready. !\[mcp-installation-en-gif\](https://http2.mlstatic.com/storage/dx-devsite/docs-assets/custom-upload/2025/4/27/1748367067297-mcpsuccessconfigcursor.png) ::: :::TabComponent{title="VS Code"} Open VS Code and press \*\*Cmnd + Shift + P\*\* if you use macOS, or \*\*Ctrl + Shift + P\*\* if you use Windows. This will position you in the search bar, located at the top margin, so you can search in your settings. Type \*\*MCP: Add Server\*\* and select that option. You will be asked for the following information: 1\. \*\*Server type:\*\* select the option \*\*HTTP (HTTP or Server-Sent Events)\*\*. 2\. \*\*Server URL:\*\* copy and paste the Mercado Pago MCP Server URL. \`\`\`plain "https://mcp.mercadopago.com/mcp" \`\`\` 3\. \*\*Name\*\* to identify the MCP: assign the one of your preference. This will update the information contained in the \`.vscode/mcp.json\` file and, after a few seconds, will open a pop-up window requesting authorization to be redirected to the Mercado Pago URL for your authentication. !\[VS Code redirect\](https://http2.mlstatic.com/storage/dx-devsite/docs-assets/custom-upload/2025/11/5/1764949890455-vscoderedirect.png) If this pop-up window does not appear automatically, you can click on \*\*Start\*\* within the same \`.vscode/mcp.json\` file. There, you must indicate which \*\*country\*\* you are operating from and, if you agree with the permissions granted, \*\*authorize the connection\*\*. Once these steps are completed, you will automatically return to VS Code and the connection to Mercado Pago MCP Server will be ready. ::: :::TabComponent{title="Windsurf"} > WARNING > > To connect with this client, you need the Access Token of an application previously created in Mercado Pago. Keep in mind that, by authenticating with credentials instead of OAuth, the application management tools (\`application\_list\`, \`create\_application\`, and \`get\_credentials\`) will not be available. You can install our MCP on Windsurf through the editor's \_MCP Store\_, or manually. Choose the option that best suits your needs. ### Installation via the MCP Store Follow the steps below to install Mercado Pago MCP Server via the Windsurf Editor's MCP Store. 1\. Access the \*\*MCP Store\*\* in the top right menu of the editor. 2\. On the search screen, type "MercadoPago" to find our MCP Server. 4\. Select the server and click \*\*Install\*\*. 5\. In the pop-up window, enter the :toolTipComponent\[Access Token\]{content ="Private key of the application created in Mercado Pago and used in the backend. You can access it through \*Your integrations\* > \*Application details\* > \*Tests\* > \*Test credentials\* or \*Production\* > \*Production credentials\*." title="Access Token"} of the account you want to connect. 6\. Save the configuration and wait for the result. !\[MCP installation via Windsurf Store\](https://http2.mlstatic.com/storage/dx-devsite/docs-assets/custom-upload/2025/7/7/1754573349844-Windsurfmcpstore.gif) If the process was successful, you will see Mercado Pago MCP Server marked as \*\*Enabled\*\* and it will be ready to use. If it is still not enabled, you can click \*\*Refresh\*\* to update the configuration. ### Manual installation If you want to manually install Mercado Pago MCP Server in Windsurf Editor, open the \`mcp\_config.json\` file and add the Mercado Pago server configuration as shown below. Make sure to complete the authorization field with your :toolTipComponent\[Access Token\]{content ="Private key of the application created in Mercado Pago and used in the backend. You can access it through \*Your integrations\* > \*Application details\* > \*Tests\* > \*Test credentials\* or \*Production\* > \*Production credentials\*." title="Access Token"}. \`\`\`json { "mcpServers": { "mercadopago-mcp-server":{ "serverUrl": "https://mcp.mercadopago.com/mcp", "headers": { "Authorization": "Bearer " } } } } \`\`\` After completing these steps, Mercado Pago MCP Server will be ready to use. To verify if the integration was successful, access your client settings and confirm that the MCP is configured as available. > WARNING > > If when checking your IDE client settings you don't find an associated MCP Server, verify that you have inserted the code correctly and click the refresh icon. Check the \[Windsurf documentation\](https://docs.codeium.com/windsurf/mcp) for more information. ::: :::TabComponent{title="Claude Code"} To connect to Mercado Pago MCP Server from Claude Code, use the following command in your terminal: \`\`\`bash claude mcp add \\ --transport http \\ mercadopago \\ https://mcp.mercadopago.com/mcp \`\`\` Then, verify the connection by running: \`\`\`bash /mcp \`\`\` You will see Mercado Pago MCP Server listed. To authenticate, click on the \*\*"needs authentication"\*\* link that appears below the MCP name. When you click on it, a pop-up window will open and redirect you to Mercado Pago to perform the authentication. In that flow, you must indicate from which \*\*country\*\* you are operating and, if you agree with the permissions granted, \*\*authorize the connection\*\*. Once these steps are completed, you will automatically return to Claude Code and the connection to Mercado Pago MCP Server will be ready to use. ::: :::TabComponent{title="Other IDEs"} > WARNING > > To configure our MCP Server using other IDEs, you must have NPM package version 6 or higher and NodeJS 20 or higher installed. Additionally, to connect you need the Access Token of an application previously created in Mercado Pago. Keep in mind that, by authenticating with credentials instead of OAuth, the application management tools (\`application\_list\`, \`create\_application\`, and \`get\_credentials\`) will not be available. Open the IDE and look for the JSON file related to MCP servers. Then, complete the \`authorization\` fields with your :toolTipComponent\[\_Access Token\_\]{content ="Private key of the application created in Mercado Pago and used in the backend. You can access it through \*Your integrations\* > \*Application details\* > \*Tests\* > \*Test credentials\* or \*Production\* > \*Production credentials\*." title="Access Token"}. Below, you can see an example of how to perform this configuration in \*\*Cline\*\*. ### Cline Open the \`cline\_mcp\_settings.json\` file and add the Mercado Pago server configuration. Remember to complete the \`authorization\` field with your :toolTipComponent\[\_Access Token\_\]{content ="Private key of the application created in Mercado Pago and used in the backend. You can access it through \*Your integrations\* > \*Application details\* > \*Tests\* > \*Test credentials\* or \*Production\* > \*Production credentials\*." title="Access Token"}. If you need more information, visit the \[Cline Desktop documentation\](https://docs.cline.bot/enterprise-solutions/mcp-servers). \`\`\`Cline { "mcpServers": { "mercadopago-mcp-server": { "command": "npx", "args": \[ "-y", "mcp-remote", "https://mcp.mercadopago.com/mcp", "--header", "Authorization:${AUTH\_HEADER}" \], "env": { "AUTH\_HEADER": "Bearer " } } } } \`\`\` After completing these steps, Mercado Pago MCP Server will be ready to use. To verify if the integration was successful, access your IDE client settings and confirm that the MCP is configured as available. > WARNING > > If when checking your IDE client settings you don't find an associated MCP Server, verify that you have inserted the code correctly and click the refresh icon. ::: :::TabComponent{title="Other clients"} > WARNING > > To configure our MCP Server using other clients, you must have NPM package version 6 or higher and NodeJS 20 or higher installed. Additionally, to connect you need the Access Token of an application previously created in Mercado Pago. Keep in mind that, by authenticating with credentials instead of OAuth, the application management tools (\`application\_list\`, \`create\_application\`, and \`get\_credentials\`) will not be available. For clients that are not IDEs, the connection is made directly in the configuration panel. #### Claude Desktop Open the \`claude\_desktop\_config.json\` file and add the Mercado Pago server configuration. Check the \[Claude Desktop documentation\](https://modelcontextprotocol.io/quickstart/user) for more information. \`\`\`json { "mcpServers": { "mercadopago-mcp-server": { "command": "npx", "args": \[ "-y", "mcp-remote", "https://mcp.mercadopago.com/mcp", "--header", "Authorization:${AUTH\_HEADER}" \], "env": { "AUTH\_HEADER": "Bearer " } } } } \`\`\` #### OpenAI If you use the paid version of OpenAI, you can add Mercado Pago MCP Server among the available \_tools\_ in your \_Playground\_. Follow the steps below. 1\. Go to the \_Playground\_ section, located in the upper right corner of the screen. 2\. In the \_Prompts\_ section, select the addition icon (\*\*+\*\*) located next to \_Tools\_. 3\. Then, click on \*\*MCP Server\*\*. A modal will open with MCP options to add. Select the \*\*+ Add new\*\* button. 4\. Fill in the form fields with the MCP Server information: \`\`\`json URL: https://mcp.mercadopago.com/mcp Label: Mercado Pago MCP Server Authentication: Access Token/Public Key: "Bearer " \`\`\` 5\. Once it's done, the server will be connected. On the screen with MCP information, enable approval of \_Tools\_ calls and select the \_Tool\_ you want to use, for example \`search-documentation\`. 6\. Finally, click \*\*Add\*\*. 7\. Run a test call through ChatGPT. See the example below: !\[OpenAI example\](https://http2.mlstatic.com/storage/dx-devsite/docs-assets/custom-upload/2025/4/27/1748353483238-openaiplatformconnect.gif) ::: :::: ## Test the connection To test the connection to the MCP Server, you need to make a query with the assistant using any of the available \_tools\_. For example, if you want to test the \_tool\_ \`search-documentation\`, you just need to execute the prompt indicating what information you want to search for: 

* [plain ](#editor%5F1)
plain 

```
Search in Mercado Pago's documentation how to integrate Checkout Pro.
```

Copiar 

!\[mcp-server\](https://http2.mlstatic.com/storage/dx-devsite/docs-assets/custom-upload/2025/4/28/1748435421551-searchdocpromptenh.gif)

# MD for: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/overview.md

 Integrate Checkout Pro and set up a predesigned experience  With this solution, your customers buy on your website and pay in the Mercado Pago environment with their saved payment methods. 

 Agile integration 

 For web, Android, and iOS 

 Pre-built experience 

 With redirection to Mercado Pago 

 Looking for development-free options? Explore [more solutions](https://www.mercadopago.com.ar/developers/pt/docs#online-payments). 

 What it offers  Combine different features to ensure transaction security and conversion. 

Customization

  * Financing in installments
  * Return URL after payment approval
  * Appearance and style of the payment button
  * Customizable payment methods with the option to split the total amount into 2 parts

Conversion

  * Quick payment with the payment methods saved in Mercado Pago
  * Option to pay without a Mercado Pago account, as a guest user
  * Online and offline payment methods, such as cards and account money
  * Recovery of rejected payments

Payment approval

  * 3DS 2.0 technology for transaction authentication
  * Fraud prevention tools and customer identity verification
  * Transaction validation using industry-specific data

Fraud protection

  * OWASP and PCI DSS protocols
  * Buyer identity verification
  * Facial recognition with FaceAuth to access the Mercado Pago account

 How it works 

 The customer chooses the product or service on your site, pays in Mercado Pago’s secure environment, and returns to your website or the configured destination. 

[ How to integrate ](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/create-application)

![](https://http2.mlstatic.com/storage/dx-devsite/docs-assets/custom-upload/2025/3/25/1745607187974-choproes990px.gif)

[ Simulate the payment processing ](https://www.mercadopago.com.ar/developers/en/live-demo/checkout-pro)

 Payment process 
1. The buyer checks out their shopping cart on your website and chooses to pay with Mercado Pago.
2. They’re redirected to the payment form, where they decide whether to proceed with their Mercado Pago account or as a guest user.
3. They can choose their preferred payment method, whether it’s one saved in their account or a new one they entered.
4. Once the purchase is completed, they are redirected to your website or the configured destination.
[ How to integrate ](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/create-application)

What sets it apartCompare our checkouts and choose the option that best fits your business. Check the [rates](https://www.mercadopago.com.ar/developers/es/support/37740).

You are here

Checkout Pro[How to integrate](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/create-application)

Checkout API[Go to the overview](https://www.mercadopago.com.ar/developers/en/docs/checkout-api-payments/overview)

Checkout Bricks[Go to the overview](https://www.mercadopago.com.ar/developers/en/docs/checkout-bricks/overview)

Integration effort

Integration effort

Integration effort

Integration effort

Customization level

Customization level

Customization level

Customization level

Design ready to set up

Design ready to set up

Design ready to set up

\-

Design ready to set up

Collection experience

Collection experience

In Mercado Pago

Collection experience

In your site

Collection experience

In your site

Recurring payments

Recurring payments

\-

Recurring payments

Recurring payments

Payment methods

Payment methods

Credit or debit card, Rapipago, Pago Fácil, Mercado Pago Account and Installments without Card

Payment methods

Credit or debit card, Rapipago, Pago Fácil, Mercado Pago Account and Installments without Card

Payment methods

Credit or debit card, Rapipago, Pago Fácil, Mercado Pago Account and Installments without Card

Availability by country

Availability by country

AR

BR

CL

CO

MX

PE

UY

Availability by country

AR

BR

CL

CO

MX

PE

UY

Availability by country

AR

BR

CL

CO

MX

PE

UY

 How to integrate 

 Learn about the steps you need to follow to integrate this solution. 

 Prerequisites 
* **Seller account**  
To integrate Checkout Pro, you need to access Mercado Pago and [create a seller account](https://www.mercadopago.com.ar/hub/registration/landing).
* **SSL Certificate (Secure Sockets Layer)**  
Allows secure browsing and the protection of your data during information transfers.

 Integration process 

1. [Create an application](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/create-application) from [Your integrations](https://www.mercadopago.com.ar/developers/panel/app).
2. [Configure the development environment](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/configure-development-enviroment).
3. [Create and configure your payment preference](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/create-payment-preference).
4. [Configure the Back URLs](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/configure-back-urls).
5. [Add the SDK to the frontend and initialize the checkout](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/web-integration/add-frontend-sdk).
6. [Configure the payment notifications](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/payment-notifications).
7. [Test your integration](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/integration-test).
8. [Go to production](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/go-to-production).
[ I want to start integrating ](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/create-application)


  flowchart TD
  A["Access Your integrations"] --> B["Create application"]
  B --> C["Build the environment"]
  C --> D["Create payment preferences"]
  D -- Amount, payment methods, details, others --> F["Configure notifications"]
  F -- Webhooks and IPN --> E["Test the integration"]
  E -- Successful tests --> H["Go to production"]
  E -- Errors detected --> I["Fix configuration"]
  I --> H
  H --> J["Measure quality"]

---

# Plan de salida a producción - Mercado Pago

## Objetivo

Migrar la aplicación desde un entorno de desarrollo utilizando credenciales TEST de Mercado Pago hacia un entorno de producción completamente funcional, manteniendo separados ambos ambientes para evitar afectar datos reales durante el desarrollo.

---

# 1. Preparación

## 1.1 Verificar cuenta de Mercado Pago

Antes de utilizar credenciales de producción confirmar que la cuenta posee:

* Identidad verificada.
* Email confirmado.
* Cuenta habilitada para cobrar.
* Datos fiscales configurados (si corresponde).

---

## 1.2 Obtener credenciales de Producción

Generar:

* Access Token (APP_USR)
* Public Key (APP_USR)

**No reemplazar todavía las credenciales TEST.**

---

# 2. Separación de entornos

Mantener dos ambientes completamente independientes.

## Desarrollo

* Credenciales TEST.
* Base de datos de desarrollo.
* Webhook mediante Cloudflare Tunnel.
* Aplicación ejecutándose en localhost.

## Producción

* Credenciales APP_USR.
* Base de datos de producción.
* Webhook apuntando al dominio real.
* Aplicación desplegada en Netlify.

---

# 3. Base de datos

Crear una base exclusiva para producción.

Ejemplo:

```
Neon

myapp-dev

myapp-prod
```

Ejecutar todas las migraciones de Drizzle sobre la nueva base.

Verificar que todas las tablas existan.

Especial atención a:

* users
* subscriptions
* credits
* payments
* reports
* creditHistory
* cualquier tabla relacionada con Mercado Pago

---

# 4. Variables de entorno

## Desarrollo

```
DATABASE_URL=...

MERCADOPAGO_ACCESS_TOKEN=TEST...

VITE_MERCADOPAGO_PUBLIC_KEY=TEST...

APP_URL=http://localhost:3000
```

## Producción

```
DATABASE_URL=...

MERCADOPAGO_ACCESS_TOKEN=APP_USR...

VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR...

APP_URL=https://mi-dominio.com
```

Si se utiliza Better Auth:

```
BETTER_AUTH_URL=https://mi-dominio.com
```

---

# 5. Webhooks

Actualizar el endpoint.

Anterior:

```
https://xxxxx.trycloudflare.com/api/webhook
```

Nuevo:

```
https://mi-dominio.com/api/webhook
```

Preferentemente enviar el `notification_url` al crear la preferencia para que cada entorno utilice automáticamente su webhook correspondiente.

---

# 6. Deploy

Realizar el deploy en Netlify.

Verificar:

* Variables cargadas.
* Build exitosa.
* Rutas funcionando.
* Endpoint del webhook accesible.

Un GET puede devolver:

```
405 Method Not Allowed
```

Lo importante es que no devuelva:

* 404
* 500

---

# 7. Verificaciones funcionales

Antes del primer pago.

## Creación de preferencias

Verificar que:

* se crea correctamente la preferencia.
* se obtiene el init_point.
* Checkout abre correctamente.

---

## Webhook

Confirmar que:

* llega el POST.
* se valida la firma.
* se consulta el Payment.
* se procesa correctamente.

---

## Idempotencia

Comprobar que un mismo payment:

* nunca acredita créditos dos veces.
* nunca genera dos registros.
* nunca consume créditos duplicados.

---

## Estados pendientes

Confirmar que:

```
pending

↓

approved
```

actualiza correctamente la información.

---

# 8. Primer pago real

Realizar un pago de importe mínimo.

Verificar todo el flujo.

```
Usuario compra

↓

Preferencia creada

↓

Checkout

↓

Pago aprobado

↓

Webhook recibido

↓

Consulta Payment

↓

Acreditar créditos

↓

Guardar paymentId

↓

Actualizar interfaz
```

---

# 9. Validaciones posteriores

Revisar:

* créditos del usuario.
* historial de créditos.
* historial de pagos.
* registros del webhook.
* logs de Netlify.

Confirmar que no existan errores.

---

# 10. Monitoreo

Durante los primeros días revisar diariamente:

* Webhooks fallidos.
* Reintentos.
* Pagos pendientes.
* Pagos rechazados.
* Logs de producción.

---

# 11. Buenas prácticas

Mantener siempre separados:

## Desarrollo

* Base de datos DEV.
* Mercado Pago TEST.
* Webhook Tunnel.

## Producción

* Base de datos PROD.
* Mercado Pago APP_USR.
* Dominio real.

Nunca desarrollar utilizando:

* Access Token de producción.
* Base de datos de producción.
* Usuarios reales.

---

# Checklist de salida a producción

* [ ] Cuenta Mercado Pago verificada.
* [ ] Credenciales APP_USR generadas.
* [ ] Base de datos de producción creada.
* [ ] Migraciones ejecutadas.
* [ ] Variables de entorno configuradas.
* [ ] Better Auth configurado.
* [ ] Public Key actualizada.
* [ ] Access Token actualizado.
* [ ] Webhook actualizado.
* [ ] Endpoint del webhook accesible.
* [ ] Preferencias funcionando.
* [ ] Firma del webhook validada.
* [ ] Idempotencia verificada.
* [ ] Manejo de pagos `pending` verificado.
* [ ] Deploy realizado.
* [ ] Primer pago real completado.
* [ ] Créditos acreditados correctamente.
* [ ] Logs revisados.
* [ ] Monitoreo inicial realizado.

---

## Mejoras futuras

Yo añadiría una sección final llamada **"Rollback"**. Muchas guías de despliegue olvidan este punto, pero es muy útil.

Por ejemplo:

* ¿Qué hacer si el webhook deja de funcionar?
* ¿Cómo volver temporalmente a la versión anterior en Netlify?
* ¿Cómo deshabilitar la venta de créditos sin afectar el resto de la aplicación?
* ¿Cómo identificar pagos que quedaron sin procesar para recuperarlos manualmente?

Documentar ese procedimiento te permitirá reaccionar mucho más rápido ante un problema en producción y también servirá como guía para futuras actualizaciones.