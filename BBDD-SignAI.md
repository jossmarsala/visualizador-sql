-- ================================================================================
-- EGI - BASE DE DATOS RELACIONALES - APOUD, CÁCERES LUPA, LACIAR, MARSALA, NAVARRO
-- ================================================================================

DROP DATABASE IF EXISTS signai_db;
CREATE DATABASE signai_db;
USE signai_db;

CREATE TABLE PROVINCIA (
    id_provincia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    pais VARCHAR(50) DEFAULT 'Argentina'
);

CREATE TABLE LOCALIDAD (
    id_localidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    id_provincia INT NOT NULL,
    FOREIGN KEY (id_provincia) REFERENCES PROVINCIA(id_provincia)
);

CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    fecha_registro DATE NOT NULL,
    id_localidad INT NOT NULL,
    FOREIGN KEY (id_localidad) REFERENCES LOCALIDAD(id_localidad)
);

CREATE TABLE PLAN_SUSCRIPCION (
    id_plan INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plan VARCHAR(50) NOT NULL,
    descripcion TEXT,
    precio_mensual DECIMAL(10,2) NOT NULL,
    limite_minutos INT
);

CREATE TABLE SUSCRIPCION (
    id_suscripcion INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('Activa', 'Vencida', 'Cancelada') DEFAULT 'Activa',
    id_usuario INT NOT NULL,
    id_plan INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_plan) REFERENCES PLAN_SUSCRIPCION(id_plan)
);

CREATE TABLE FORMA_PAGO (
    id_forma INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE MEDIO_PAGO (
    id_medio INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE FACTURA (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    tipo_comprobante ENUM('A', 'B', 'C') NOT NULL,
    fecha_emision DATE NOT NULL,
    total DECIMAL(12,2) DEFAULT 0,
    id_suscripcion INT NOT NULL,
    FOREIGN KEY (id_suscripcion) REFERENCES SUSCRIPCION(id_suscripcion)
);

CREATE TABLE DETALLE_FACTURA (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_factura INT NOT NULL,
    concepto VARCHAR(150) NOT NULL,
    cantidad INT DEFAULT 1,
    precio_unitario DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES FACTURA(id_factura)
);

CREATE TABLE PAGO_FACTURA (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_factura INT NOT NULL,
    id_forma INT NOT NULL,
    id_medio INT NOT NULL,
    monto_abonado DECIMAL(12,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES FACTURA(id_factura),
    FOREIGN KEY (id_forma) REFERENCES FORMA_PAGO(id_forma),
    FOREIGN KEY (id_medio) REFERENCES MEDIO_PAGO(id_medio)
);

CREATE TABLE PLATAFORMA_ORIGEN (
    id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plataforma VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE SENA (
    id_sena INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    significado VARCHAR(100) NOT NULL,
    categoria ENUM('Saludo', 'Abecedario', 'Verbo', 'Sustantivo', 'Expresion') NOT NULL,
    ruta_validacion VARCHAR(255) NOT NULL
);

CREATE TABLE VERSION_MODELO (
    id_version INT AUTO_INCREMENT PRIMARY KEY,
    version_texto VARCHAR(20) NOT NULL,
    fecha_despliegue DATE NOT NULL,
    notas_mejora TEXT
);

CREATE TABLE SESION_TRADUCCION (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora_inicio DATETIME NOT NULL,
    duracion_segundos INT NOT NULL,
    tipo_salida ENUM('Texto', 'Audio') NOT NULL,
    total_senas INT DEFAULT 0,
    id_usuario INT NOT NULL,
    id_version INT NOT NULL,
    id_plataforma INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_version) REFERENCES VERSION_MODELO(id_version),
    FOREIGN KEY (id_plataforma) REFERENCES PLATAFORMA_ORIGEN(id_plataforma)
);

CREATE TABLE SESION_SENA (
    id_sesion INT NOT NULL,
    id_sena INT NOT NULL,
    confianza_reconocimiento DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (id_sesion, id_sena),
    FOREIGN KEY (id_sesion) REFERENCES SESION_TRADUCCION(id_sesion),
    FOREIGN KEY (id_sena) REFERENCES SENA(id_sena)
);

CREATE TABLE FEEDBACK_SESION (
    id_feedback INT AUTO_INCREMENT PRIMARY KEY,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    id_sesion INT UNIQUE NOT NULL,
    FOREIGN KEY (id_sesion) REFERENCES SESION_TRADUCCION(id_sesion)
);

CREATE TABLE LOG_ERROR (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    descripcion_error VARCHAR(255) NOT NULL,
    id_sesion INT NOT NULL,
    FOREIGN KEY (id_sesion) REFERENCES SESION_TRADUCCION(id_sesion)
);

INSERT INTO PROVINCIA (nombre, pais) VALUES 
('Mendoza', 'Argentina'), ('Buenos Aires', 'Argentina'), ('Santa Fe', 'Argentina'), 
('Cordoba', 'Argentina'), ('San Luis', 'Argentina'), ('San Juan', 'Argentina'), 
('Entre Rios', 'Argentina'), ('Tucuman', 'Argentina'), ('Salta', 'Argentina'), ('Neuquen', 'Argentina');

INSERT INTO LOCALIDAD (nombre, id_provincia) VALUES 
('Mendoza Capital', 1), ('Godoy Cruz', 1), ('CABA', 2), ('Rosario', 3), 
('Cordoba Capital', 4), ('Merlo', 5), ('San Juan Capital', 6), ('Parana', 7), 
('San Miguel', 8), ('Salta Capital', 9);

INSERT INTO USUARIO (nombre, apellido, email, nombre_usuario, fecha_registro, id_localidad) VALUES 
('Santiago', 'Apoud', 'santiago@email.com', 'santia', '2026-01-10', 1),
('Uriel', 'Caceres', 'uriel@email.com', 'ucaceres', '2026-02-15', 2),
('Juan', 'Gomez', 'juang@email.com', 'juang', '2026-03-01', 3),
('Lionel', 'Messi', 'lio@email.com', 'leomessi', '2026-03-02', 4),
('Angel', 'Di Maria', 'fideo@email.com', 'angelito', '2026-03-05', 4),
('Luciana', 'Aymar', 'lucha@email.com', 'luchaymar', '2026-03-06', 4),
('Emanuel', 'Ginobili', 'manu@email.com', 'manug', '2026-03-10', 5),
('Carlos', 'Tevez', 'apache@email.com', 'carlitos', '2026-03-12', 6),
('Juan', 'Riquelme', 'roman@email.com', 'jr10', '2026-03-15', 2),
('Diego', 'Maradona', 'diego@email.com', 'pelusa', '2026-03-20', 1);

INSERT INTO PLAN_SUSCRIPCION (nombre_plan, descripcion, precio_mensual, limite_minutos) VALUES 
('Freemium', 'Plan basico gratuito limitado', 0.00, 60),
('Premium Mensual', 'Uso ilimitado individual', 5000.00, NULL),
('Premium Anual', 'Uso ilimitado individual. Se paga una vez al anio', 50000.00, NULL),
('Institucional Educativo', 'Plan premium anual para escuelas', 850000.00, NULL),
('B2B Pymes', 'Uso de la api para Pymes', 300000.00, NULL),
('B2B Pro', 'Uso de la api para empresas grandes', 800000.00, NULL),
('Premium Trimestral', 'Uso ilimitado individual. Se paga cada 3 meses', 14000.00, NULL),
('Pack Familiar', 'Hasta 4 cuentas integradas', 17000.00, NULL),
('Pack Familiar Trimestral', 'Hasta 4 cuentas integradas. Se cobra cada 3 meses', 47000.00, NULL),
('Pack Familiar Anual', 'Hasta 4 cuentas integradas. Se cobra una vez al anio', 137500.00, NULL);

INSERT INTO SUSCRIPCION (fecha_inicio, fecha_fin, estado, id_usuario, id_plan) VALUES 
('2026-01-10', '2027-01-10', 'Activa', 1, 2),
('2026-02-15', '2026-03-15', 'Activa', 2, 1),
('2026-03-01', '2026-04-01', 'Activa', 3, 4),
('2026-03-02', '2026-04-02', 'Activa', 4, 2),
('2026-03-05', '2026-04-05', 'Activa', 5, 2),
('2026-03-06', '2026-04-06', 'Vencida', 6, 1),
('2026-03-10', '2026-04-10', 'Activa', 7, 5),
('2026-03-12', '2026-04-12', 'Cancelada', 8, 1),
('2026-03-15', '2026-04-15', 'Activa', 9, 9),
('2026-03-20', '2027-03-20', 'Activa', 10, 3);

INSERT INTO FORMA_PAGO (descripcion) VALUES 
('Debito Automatico Mensual'), 
('Pago Anual Adelantado'), 
('Abono Prepago Mensual');

INSERT INTO MEDIO_PAGO (descripcion) VALUES 
('Tarjeta de Credito'), 
('Tarjeta de Debito'), 
('Billetera Virtual'), 
('Criptomonedas (USDT)');

INSERT INTO FACTURA (tipo_comprobante, fecha_emision, total, id_suscripcion) VALUES 
('B', '2026-01-10', 5000.00, 1),
('B', '2026-02-15', 0.00, 2),
('A', '2026-03-01', 850000.00, 3),
('B', '2026-03-02', 5000.00, 4),
('B', '2026-03-05', 5000.00, 5),
('C', '2026-03-06', 0.00, 6),
('A', '2026-03-10', 300000.00, 7),
('B', '2026-03-12', 0.00, 8),
('B', '2026-03-15', 47000.00, 9),
('B', '2026-03-20', 50000.00, 10);

INSERT INTO DETALLE_FACTURA (id_factura, concepto, cantidad, precio_unitario, subtotal) VALUES 
(1, 'Abono Premium Mensual', 1, 5000.00, 5000.00), 
(2, 'Suscripcion Freemium', 1, 0.00, 0.00),
(3, 'Licencia Institucional Educativa Anual', 1, 850000.00, 850000.00), 
(4, 'Abono Premium Mensual', 1, 5000.00, 5000.00),
(5, 'Abono Premium Mensual', 1, 5000.00, 5000.00), 
(6, 'Suscripcion Freemium', 1, 0.00, 0.00),
(7, 'Licencia API B2B Pymes', 1, 300000.00, 300000.00), 
(8, 'Suscripcion Freemium', 1, 0.00, 0.00),
(9, 'Abono Pack Familiar Trimestral', 1, 47000.00, 47000.00), 
(10, 'Abono Premium Anual Adelantado', 1, 50000.00, 50000.00);

INSERT INTO PAGO_FACTURA (id_factura, id_forma, id_medio, monto_abonado, fecha_pago) VALUES 
(1, 1, 1, 5000.00, '2026-01-10'),
(3, 2, 2, 850000.00, '2026-03-01'),
(4, 1, 1, 5000.00, '2026-03-02'),
(5, 3, 3, 5000.00, '2026-03-05'),
(7, 3, 2, 300000.00, '2026-03-10'),
(9, 3, 4, 47000.00, '2026-03-15'),
(10, 2, 1, 50000.00, '2026-03-20');

INSERT INTO PLATAFORMA_ORIGEN (nombre_plataforma) VALUES 
('SignAI Web App'), ('Zoom Plugin'), ('Google Meet Extension'), ('Microsoft Teams App'), ('WhatsApp Web Bot'),
('iOS App'), ('Android Native App'), ('Desktop Windows Client'), ('SDK Integracion Externa'), ('Linux Extension');

INSERT INTO SENA (codigo, significado, categoria, ruta_validacion) VALUES 
('SAL_01', 'Hola', 'Saludo', '/assets/val_hola.mp4'), ('SAL_02', 'Gracias', 'Saludo', '/assets/val_gracias.mp4'),
('AB_A', 'Letra A', 'Abecedario', '/assets/val_a.mp4'), ('AB_B', 'Letra B', 'Abecedario', '/assets/val_b.mp4'),
('VER_01', 'Comer', 'Verbo', '/assets/val_comer.mp4'), ('VER_02', 'Ayudar', 'Verbo', '/assets/val_ayudar.mp4'),
('SUST_01', 'Familia', 'Sustantivo', '/assets/val_familia.mp4'), ('SUST_02', 'Casa', 'Sustantivo', '/assets/val_casa.mp4'),
('EXP_01', 'Te amo', 'Expresion', '/assets/val_teamo.mp4'), ('EXP_02', 'Buenos dias', 'Expresion', '/assets/val_buenosdias.mp4');

INSERT INTO VERSION_MODELO (version_texto, fecha_despliegue, notas_mejora) VALUES 
('v1.0', '2025-11-01', 'Lanzamiento inicial'), ('v1.1', '2025-12-15', 'Optimizacion de landmarks faciales'),
('v1.2', '2026-01-20', 'Correccion de falsos positivos en saludos'), ('v2.0', '2026-02-10', 'Implementacion de MediaPipe Avanzado'),
('v2.1', '2026-02-28', 'Soporte mejorado para baja luminosidad'), ('v2.2', '2026-03-10', 'Inclusion de verbos de movimiento continuo'),
('v2.3', '2026-03-25', 'Reduccion de latencia en la API'), ('v3.0', '2026-04-15', 'Reconocimiento contextual por redes LSTM'),
('v3.1', '2026-05-01', 'Traducción directa a audio sintetizado'), ('v3.2', '2026-05-20', 'Modelo optimizado para ejecucion movil');

INSERT INTO SESION_TRADUCCION (fecha_hora_inicio, duracion_segundos, tipo_salida, total_senas, id_usuario, id_version, id_plataforma) VALUES 
('2026-04-10 14:30:00', 120, 'Texto', 2, 1, 4, 2), ('2026-04-12 10:15:00', 45, 'Audio', 1, 2, 4, 3),
('2026-04-15 18:00:00', 300, 'Texto', 4, 3, 5, 1), ('2026-04-16 09:00:00', 600, 'Texto', 12, 4, 5, 2),
('2026-04-17 11:30:00', 150, 'Audio', 3, 5, 5, 4), ('2026-04-18 20:15:00', 80, 'Texto', 1, 6, 5, 7),
('2026-04-19 16:45:00', 450, 'Texto', 8, 7, 6, 8), ('2026-04-20 13:00:00', 90, 'Audio', 2, 8, 6, 6),
('2026-04-21 22:10:00', 1200, 'Texto', 25, 9, 7, 9), ('2026-04-22 10:00:00', 350, 'Texto', 6, 10, 7, 1);

INSERT INTO SESION_SENA (id_sesion, id_sena, confianza_reconocimiento) VALUES 
(1, 1, 98.50), (1, 9, 95.20), (2, 2, 89.00), (3, 1, 99.10), (3, 2, 94.00),
(3, 7, 91.30), (3, 8, 88.50), (4, 5, 96.00), (5, 10, 97.40), (6, 3, 93.00);

INSERT INTO FEEDBACK_SESION (puntuacion, comentario, id_sesion) VALUES 
(5, 'Traduccion perfecta en videollamada', 1), (3, 'Tardo un poco con baja luz', 2),
(5, 'Excelente integracion web', 3), (4, 'Muy util para las clases', 4),
(5, 'Impecable fideo', 5), (4, 'Cumple bien', 6),
(5, 'Soporta frases largas', 7), (2, 'Fallo la salida de audio', 8),
(5, 'Estable durante toda la conferencia', 9), (4, 'Muy buen diccionario', 10);

INSERT INTO LOG_ERROR (descripcion_error, id_sesion) VALUES 
('Falla de conexion de video (Frame nulo)', 2), ('Timeout en resolucion de API externa', 4),
('Hand landmarks perdidos por oclusion', 5), ('Error de inicialización de sintetizador', 8),
('Falla de hardware - Camara desconectada', 2), ('Perdida de paquetes en canal WebRTC', 9),
('Frame rate caido por debajo de 15 FPS', 7), ('Error interno de segmentación de manos', 4),
(' hand tracking confidence score inferior al umbral', 10), ('Advertencia: Retardo en procesamiento de red', 9);


-- Vista 1: Reporte de rendimiento de precisión del modelo IA
CREATE VIEW vista_precision_modelo AS
SELECT 
    v.version_texto,
    s.significado AS sena_detectada,
    AVG(ss.confianza_reconocimiento) AS confianza_promedio,
    COUNT(ss.id_sena) AS total_detecciones
FROM SESION_SENA ss
JOIN SESION_TRADUCCION st ON ss.id_sesion = st.id_sesion
JOIN VERSION_MODELO v ON st.id_version = v.id_version
JOIN SENA s ON ss.id_sena = s.id_sena
GROUP BY v.version_texto, s.significado;

-- Vista 2: Auditoría del Consumo de Usuarios Premium/Activos
CREATE VIEW vista_uso_usuarios AS
SELECT 
    u.email,
    p.nombre_plan,
    COUNT(st.id_sesion) AS total_sesiones,
    SUM(st.duracion_segundos) / 60 AS minutos_consumidos
FROM USUARIO u
JOIN SUSCRIPCION sus ON u.id_usuario = sus.id_usuario
JOIN PLAN_SUSCRIPCION p ON sus.id_plan = p.id_plan
JOIN SESION_TRADUCCION st ON u.id_usuario = st.id_usuario
WHERE sus.estado = 'Activa'
GROUP BY u.email, p.nombre_plan;

-- Vista 3: Ranking de las señas más utilizadas por la comunidad
CREATE VIEW vista_senas_mas_utilizadas AS
SELECT 
    s.codigo,
    s.significado,
    s.categoria,
    COUNT(ss.id_sesion) AS veces_detectada
FROM SENA s
JOIN SESION_SENA ss ON s.id_sena = ss.id_sena
GROUP BY s.id_sena
ORDER BY veces_detectada DESC;

-- Vista 4: Control de facturación total por mes
CREATE VIEW vista_ingresos_mensuales AS
SELECT 
    YEAR(fecha_emision) AS anio,
    MONTH(fecha_emision) AS mes,
    COUNT(id_factura) AS cantidad_facturas,
    SUM(total) AS ingresos_totales
FROM FACTURA
GROUP BY YEAR(fecha_emision), MONTH(fecha_emision)
ORDER BY anio DESC, mes DESC;

-- Vista 5: Historial de errores por plataforma (Para el equipo de desarrollo)
CREATE VIEW vista_errores_plataforma AS
SELECT 
    p.nombre_plataforma,
    COUNT(l.id_log) AS cantidad_errores,
    v.version_texto
FROM LOG_ERROR l
JOIN SESION_TRADUCCION st ON l.id_sesion = st.id_sesion
JOIN PLATAFORMA_ORIGEN p ON st.id_plataforma = p.id_plataforma
JOIN VERSION_MODELO v ON st.id_version = v.id_version
GROUP BY p.nombre_plataforma, v.version_texto;


DELIMITER //

-- SP 1: Inserción simplificada de incidentes del motor de IA
CREATE PROCEDURE sp_registrar_error_ia(
    IN p_id_sesion INT, 
    IN p_descripcion VARCHAR(255)
)
BEGIN
    INSERT INTO LOG_ERROR (descripcion_error, id_sesion) 
    VALUES (p_descripcion, p_id_sesion);
END //

-- SP 2: Actualización de precios masivos para la estructura comercial
CREATE PROCEDURE sp_actualizar_precio_plan(
    IN p_id_plan INT, 
    IN p_nuevo_precio DECIMAL(10,2)
)
BEGIN
    UPDATE PLAN_SUSCRIPCION 
    SET precio_mensual = p_nuevo_precio 
    WHERE id_plan = p_id_plan;
END //

-- SP 3: Cancelación rápida de suscripción
CREATE PROCEDURE sp_cancelar_suscripcion(
    IN p_id_suscripcion INT
)
BEGIN
    UPDATE SUSCRIPCION 
    SET estado = 'Cancelada', fecha_fin = CURDATE()
    WHERE id_suscripcion = p_id_suscripcion;
END //

-- SP 4: Registro rápido de Feedback del usuario
CREATE PROCEDURE sp_registrar_feedback(
    IN p_id_sesion INT,
    IN p_puntuacion INT,
    IN p_comentario TEXT
)
BEGIN
    INSERT INTO FEEDBACK_SESION (id_sesion, puntuacion, comentario)
    VALUES (p_id_sesion, p_puntuacion, p_comentario);
END //

-- SP 5: Alta rápida de un usuario asignando el plan Freemium por defecto
CREATE PROCEDURE sp_alta_usuario_freemium(
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_nombre_usuario VARCHAR(50),
    IN p_id_localidad INT
)
BEGIN
    DECLARE nuevo_id INT;
    
    -- Inserta el usuario
    INSERT INTO USUARIO (nombre, apellido, email, nombre_usuario, fecha_registro, id_localidad)
    VALUES (p_nombre, p_apellido, p_email, p_nombre_usuario, CURDATE(), p_id_localidad);
    
    -- Obtiene el ID generado
    SET nuevo_id = LAST_INSERT_ID();
    
    -- Le asigna el plan Freemium (asumiendo que el ID 1 es el plan gratuito)
    INSERT INTO SUSCRIPCION (fecha_inicio, fecha_fin, estado, id_usuario, id_plan)
    VALUES (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'Activa', nuevo_id, 1);
END //

-- Trigger 1: Validación estricta matemática de la IA (No existe > 100%)
CREATE TRIGGER trg_validar_confianza_ia
BEFORE INSERT ON SESION_SENA
FOR EACH ROW
BEGIN
    IF NEW.confianza_reconocimiento < 0 OR NEW.confianza_reconocimiento > 100 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error critico: La confianza del modelo debe estar entre 0% y 100%.';
    END IF;
END //

-- Trigger 2: Control contra fraudes financieros en borrado de facturas
CREATE TRIGGER trg_evitar_borrado_factura_pagada
BEFORE DELETE ON FACTURA
FOR EACH ROW
BEGIN
    DECLARE pagos_existentes INT;
    SELECT COUNT(*) INTO pagos_existentes 
    FROM PAGO_FACTURA 
    WHERE id_factura = OLD.id_factura;
    
    IF pagos_existentes > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Operacion bloqueada: No se puede eliminar una factura que ya registra pagos financieros.';
    END IF;
END //

-- Trigger 3: Lógica de coherencia temporal en suscripciones
CREATE TRIGGER trg_fechas_suscripcion_coherentes
BEFORE INSERT ON SUSCRIPCION
FOR EACH ROW
BEGIN
    IF NEW.fecha_fin <= NEW.fecha_inicio THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error de coherencia: La fecha de finalización debe ser posterior a la fecha de inicio.';
    END IF;
END //

-- Trigger 4: Protección contra precios negativos en los planes
CREATE TRIGGER trg_prevenir_precio_negativo
BEFORE UPDATE ON PLAN_SUSCRIPCION
FOR EACH ROW
BEGIN
    IF NEW.precio_mensual < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error comercial: El precio mensual de un plan de SignAI no puede ser negativo.';
    END IF;
END //

-- Trigger 5: Evitar eliminar usuarios que tengan facturas emitidas a su nombre
CREATE TRIGGER trg_proteger_usuario_facturado
BEFORE DELETE ON USUARIO
FOR EACH ROW
BEGIN
    DECLARE facturas_existentes INT;
    
    SELECT COUNT(*) INTO facturas_existentes
    FROM FACTURA f
    JOIN SUSCRIPCION s ON f.id_suscripcion = s.id_suscripcion
    WHERE s.id_usuario = OLD.id_usuario;
    
    IF facturas_existentes > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Regla de negocio: No se puede eliminar un usuario con historial de facturación.';
    END IF;
END //

DELIMITER ;

-- 1. SELECT avanzado con JOIN de 5 tablas para auditoría completa de uso por geografía
SELECT 
    u.nombre_usuario,
    l.nombre AS ciudad,
    st.fecha_hora_inicio,
    plat.nombre_plataforma,
    v.version_texto
FROM SESION_TRADUCCION st
JOIN USUARIO u ON st.id_usuario = u.id_usuario
JOIN LOCALIDAD l ON u.id_localidad = l.id_localidad
JOIN PLATAFORMA_ORIGEN plat ON st.id_plataforma = plat.id_plataforma
JOIN VERSION_MODELO v ON st.id_version = v.id_version
WHERE l.nombre = 'Rosario';

-- 2. UPDATE: Cambio operacional de estado de una suscripción
UPDATE SUSCRIPCION 
SET estado = 'Vencida' 
WHERE id_suscripcion = 3;

-- 3. DELETE: Eliminación de un log antiguo o descartado
DELETE FROM LOG_ERROR 
WHERE id_log = 3;

-- 4. ALTER TABLE: Agregar columna de control técnico al historial de versiones
ALTER TABLE VERSION_MODELO ADD COLUMN desarrollador_cargo VARCHAR(100) NULL;

-- 5. RENAME TABLE: Demostración de cambio de nombre de entidad (ida y vuelta)
RENAME TABLE LOG_ERROR TO HISTORIAL_ERRORES;
RENAME TABLE HISTORIAL_ERRORES TO LOG_ERROR;

-- 6. TRUNCATE TABLE: Vaciado limpio usando bypass estructural seguro
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE LOG_ERROR;
SET FOREIGN_KEY_CHECKS = 1;

-- 7. DROP: Eliminación controlada preventiva
DROP VIEW IF EXISTS vista_uso_usuarios;

-- Mejora del SQL
CREATE TABLE COLECCION_PERSONAL (
	id_coleccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_coleccion VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    fecha_creacion DATE NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);
CREATE TABLE COLECCION_SENA (
    id_coleccion INT NOT NULL,
    id_sena INT NOT NULL,
    fecha_agregado DATE NOT NULL,
    PRIMARY KEY (id_coleccion, id_sena),
    FOREIGN KEY (id_coleccion) REFERENCES COLECCION_PERSONAL(id_coleccion),
    FOREIGN KEY (id_sena) REFERENCES SENA(id_sena)
);
INSERT INTO COLECCION_PERSONAL (nombre_coleccion, descripcion, fecha_creacion, id_usuario) VALUES 
('Basicos para Viajar', 'Senas para usar en el aeropuerto y hotel', '2026-06-01', 1),
('Verbos Dificiles', 'Lista de verbos de movimiento complejo', '2026-06-05', 1);
INSERT INTO COLECCION_SENA (id_coleccion, id_sena, fecha_agregado) VALUES 
(1, 1, '2026-06-01'),
(1, 2, '2026-06-01');
INSERT INTO COLECCION_SENA (id_coleccion, id_sena, fecha_agregado) VALUES 
(2, 6, '2026-06-05');

-- MEJORA EXTRA (GRUPO DE 5): AUDITORÍA Y GESTIÓN DE FRAUDE

CREATE TABLE AUDITORIA_PRECIOS (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    id_plan INT NOT NULL,
    precio_anterior DECIMAL(10,2) NOT NULL,
    precio_nuevo DECIMAL(10,2) NOT NULL,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_db VARCHAR(50),
    FOREIGN KEY (id_plan) REFERENCES PLAN_SUSCRIPCION(id_plan)
);

-- Triggers extra

DELIMITER //

-- Trigger extra 1: Registro Automático de Auditoría (por cada UPDATE en los precios, el trigger guarda el historial)

CREATE TRIGGER trg_auditar_cambio_precio
AFTER UPDATE ON PLAN_SUSCRIPCION
FOR EACH ROW
BEGIN
	IF OLD.precio_mensual <> NEW.precio_mensual THEN
		INSERT INTO AUDITORIA_PRECIOS (id_plan, precio_anterior, precio_nuevo, usuario_db)
		VALUES (OLD.id_plan, OLD.precio_mensual, NEW.precio_mensual, USER());
    END IF;
END //

-- Trigger extra 2: Control Anti-Abuso (Evita que un usuario inicie una sesión si su suscripción está vencida o cancelada)

CREATE TRIGGER trg_control_acceso_sesion
BEFORE INSERT ON SESION_TRADUCCION
FOR EACH ROW
BEGIN
	DECLARE estado_actual VARCHAR(20);
    SELECT estado INTO estado_actual
    FROM SUSCRIPCION
    WHERE id_usuario = NEW.id_usuario
    ORDER BY fecha_inicio DESC LIMIT 1;
    
    IF estado_actual != 'Activa' THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Acceso Denegado: El usuario no tiene una suscripción activa para usar SignAI.';
	END IF;
END //

DELIMITER ;

DELIMITER //

-- Procedure Extra 1: Mantenimiento de la base de datos (Borra los errores tecnicos que tengan más de X días para no saturar el servidor)

CREATE PROCEDURE sp_limpieza_logs_antiguos (IN p_dias INT)
BEGIN
	DELETE FROM LOG_ERROR
    WHERE id_sesion in (
		SELECT id_sesion FROM SESION_TRADUCCION
        WHERE DATEDIFF(CURDATE(), fecha_hora_inicio) > p_dias
    );
END //

-- Procedure Extra 2: Generación de factura masiva mensual

CREATE PROCEDURE sp_facturacion_mensual_masiva()
BEGIN
    INSERT INTO FACTURA (tipo_comprobante, fecha_emision, total, id_suscripcion)
    SELECT 'B', CURDATE(), p.precio_mensual, s.id_suscripcion
    FROM SUSCRIPCION s
    JOIN PLAN_SUSCRIPCION p ON s.id_plan = p.id_plan
    WHERE s.estado = 'Activa' AND p.precio_mensual > 0
    -- Lógica inteligente de ciclos de facturación:
    AND (
        -- 1. CICLO ANUAL: Cobra solo si pasaron exactamente múltiplos de 12 meses desde el inicio
        ((p.nombre_plan LIKE '%Anual%' OR p.nombre_plan LIKE '%Educativo%') 
          AND TIMESTAMPDIFF(MONTH, s.fecha_inicio, CURDATE()) % 12 = 0)
          
        OR
        -- 2. CICLO TRIMESTRAL: Cobra solo si pasaron múltiplos de 3 meses (ej. mes 3, 6, 9)
        (p.nombre_plan LIKE '%Trimestral%' 
          AND TIMESTAMPDIFF(MONTH, s.fecha_inicio, CURDATE()) % 3 = 0)
          
        OR
        -- 3. CICLO MENSUAL: Si no es ni anual ni trimestral, se cobra todos los meses
        (p.nombre_plan NOT LIKE '%Anual%' 
          AND p.nombre_plan NOT LIKE '%Trimestral%' 
          AND p.nombre_plan NOT LIKE '%Educativo%')
    );
END //

DELIMITER ;

-- Vista Extra 1: Muestra los usuarios cuya suscripción vence en los próximos 15 días

CREATE VIEW vistas_alertas_vencimiento AS
SELECT
	u.nombre_usuario,
    u.email,
	p.nombre_plan,
    s.fecha_fin,
    DATEDIFF(s.fecha_fin, CURDATE()) AS dias_restantes
FROM USUARIO u
JOIN SUSCRIPCION s ON u.id_usuario = s.id_usuario
JOIN PLAN_SUSCRIPCION p ON s.id_plan = p.id_plan
WHERE s.estado = 'Activa'
	AND DATEDIFF(s.fecha_fin, CURDATE()) BETWEEN 0 AND 15;
    
-- Vista Extra 2: Comparativa de precisión entre versiones de la IA

CREATE VIEW vista_evolucion_modelos AS
SELECT
	v.version_texto,
    COUNT(st.id_sesion) AS total_sesiones_procesadas,
    AVG(ss.confianza_reconocimiento) AS precision_global_promedio
FROM VERSION_MODELO v
LEFT JOIN SESION_TRADUCCION st ON v.id_version = st.id_version
LEFT JOIN SESION_SENA ss ON st.id_sesion = ss.id_sesion
GROUP BY v.version_texto
ORDER BY v.version_texto DESC;