import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // Si el token existe, clonar la petición y añadirle la cabecera de autorización
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Pasa la petición clonada al siguiente manejador
    return next(clonedReq);
  }

  // Si no hay token, pasa la petición original sin modificar
  return next(req);
};
