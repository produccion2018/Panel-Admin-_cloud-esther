# Cloud Esther Admin Hub

Necesito que diseñes ÚNICAMENTE la vista/maqueta visual de un panel de SUPERADMINISTRACIÓN para "Cloud Esther" — este panel NO es para las clínicas que se suscriben (eso ya está resuelto en el panel de cada cuenta cliente), y NO es una página pública: tiene que vivir dentro del mismo proyecto pero como una ruta privada, sin ningún link ni mención en la landing pública ni en el panel de las clínicas clientes. Solo yo y mi socio sabemos que existe y entramos ahí directo por la URL. Es el panel interno con el que administramos el negocio completo: todas las clínicas que son clientes, sus pagos y su consumo de IA. No implementes backend, lógica real de autenticación, ni conectes nada funcional — es solo diseño/maqueta, tipo Figma, para previsualizar cómo se vería. Los datos y gráficos en tiempo real los voy a conectar yo después por mi cuenta; acá solo necesito que se vean con datos de ejemplo.

CONTEXTO Cloud Esther es un SaaS: distintas clínicas se suscriben y pagan una membresía mensual según su plan. Necesito un panel aparte, de "superadmin", para controlar el negocio en sí — no la operación de ninguna clínica en particular. Repito: esta parte NO debe quedar visible ni accesible desde la navegación pública del sitio ni desde el panel de las clínicas — es una ruta separada, privada, dentro del mismo proyecto.

QUÉ QUIERO QUE GENERES

PANTALLA DE LOGIN propia de este panel de superadmin (distinta a la de las clínicas clientes), con el logo del diente y la identidad de Cloud Esther, campo de usuario/contraseña, opción "cambiar contraseña".

UN DASHBOARD PRINCIPAL con:

Total de empresas/clínicas activas como clientes (número grande, tipo KPI)

Gráfico de crecimiento de empresas a lo largo del tiempo (cuántas clínicas nuevas por mes)

Resumen de estado de pagos: cuántas clínicas están al día, cuántas tienen el pago pendiente, cuántas están en mora/atrasadas — con colores (verde/amarillo/rojo)

Lista o tabla de clínicas con: nombre, plan contratado, estado de pago (pagó / no pagó / falta por pagar), próxima fecha de cobro

Consumo de IA por clínica: qué clínica consume más IA (ranking o gráfico de barras), y cuánto tiempo/uso de IA en total a nivel de toda la plataforma

Todo con gráficos (barras, líneas, dona) usando la misma paleta violeta de Cloud Esther

SECCIÓN DE CUENTA / CONFIGURACIÓN:

Ver y editar mi perfil

Cambiar contraseña

Gestión de accesos: quién más tiene acceso a este panel de superadmin (para poder agregar a mi socio)

ROLES DENTRO DE ESTE PANEL DE SUPERADMIN Necesito ver el mismo panel adaptado a 2 roles distintos:

Dueño (yo): acceso completo a todo lo anterior, incluida la parte financiera/facturación completa

Socio administrativo: mismo panel, mismo lenguaje visual, enfocado en el seguimiento operativo — puede ver el estado de pagos de cada clínica (quién pagó, quién no, quién falta por pagar), la lista de empresas y el consumo de IA por clínica, pero SIN acceso a configuración de cuenta del Dueño ni a gestión de accesos de otros usuarios

IMPORTANTE

La ruta de este panel (login incluido) debe ser una URL propia, distinta a "/" y a "/app" (por ejemplo algo tipo "/admin" o similar), que NO aparezca en ningún menú de navegación público ni en el panel de las clínicas — no debe haber ningún link visible hacia acá desde el resto del sitio

Mantené la identidad visual de Cloud Esther: paleta violeta, el logo del diente, tipografía Plus Jakarta Sans/Inter, mismo estilo de sidebar y cards que ya tiene el panel de las clínicas clientes

Dejalo claro visualmente en el sidebar/header que este es un panel distinto ("Cloud Esther — Administración" o similar), para no confundirlo con el panel de una clínica cliente

Es SOLO diseño para revisar cómo se ve — no me generes lógica de autenticación real, ni conexión a ninguna base de datos; los números y gráficos pueden ser datos de ejemplo/mock

Si se te ocurre algo más que normalmente tendría un panel de superadmin de un SaaS (por ejemplo: tickets de soporte, logs de actividad, alertas), agregalo como sugerencia visual — decime qué agregaste para que yo lo evalúe

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe98246b-2f9a-4576-b9ec-6826a24701e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
