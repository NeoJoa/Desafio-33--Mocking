<h1>CoderHouse-Backend--Desafio 33-Mocking</h1>
<h2>Aplicación web de Ecommerce de productos.</h2>



Antes de ejecutar el comando, deben detallarse: PORT CONNECTION BCRYPTGENSALT JWTKEY PERSISTENCE MAILPASSWORD, en el .env que esta oculto pero deje un archivo.txt con los detalles.

El proyecto esta formado con varias APIs: son session, carts, products, tickets y messages, para acceder a cada una de ellas, la URL es /api/nombreApi/metodo

El proyecto puede trabajar tanto con Mongo como con persistencia en archivos, esto se define en el PERSISTENCE del .env y utiliza el patrón Factory para alternar entre estos

La aplicación cuenta con varias secciones, incluyendo un chat para usuarios, un sistema de roles para la creación y modificación de archivos, usuarios con carritos autogenerados para cada usuario, sistema de compras con control y verificación de stock y motor de plantillas con handlebars

La ruta /api/products/mockProducts arroja 100 productos como si fuese una petición a MongoDB, no tiene ninguna modificacion

El usuario administrador tiene como email adminCoder@coder.com y como contraseña adminCod3r123.
