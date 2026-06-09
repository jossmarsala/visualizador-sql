// ═══════════════════════════════════════════════════════════
//  SIGN AI — Database Visual Map  ·  Interactive JS
// ═══════════════════════════════════════════════════════════

// ── TAB NAVIGATION ──
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('sec-' + tab.dataset.tab).classList.add('active');
  });
});

// ═══════════════════════════════════════════
//  TABLE DATA — all schema info in one place
// ═══════════════════════════════════════════

const tables = {
  geo: [
    {
      name: 'PROVINCIA',
      purpose: 'Divisiones geopolíticas de nivel 1. Default: Argentina.',
      style: 'geo',
      keys: [{ tag: 'PK', col: 'id_provincia' }],
      relations: [{ arrow: '↓', target: 'LOCALIDAD', note: '1:N' }]
    },
    {
      name: 'LOCALIDAD',
      purpose: 'Ciudades / localidades dentro de una provincia. Ubica a los usuarios de SignAI.',
      style: 'geo',
      keys: [
        { tag: 'PK', col: 'id_localidad' },
        { tag: 'FK', col: 'id_provincia → PROVINCIA' }
      ],
      relations: [
        { arrow: '↓', target: 'USUARIO', note: '1:N' }
      ]
    }
  ],
  users: [
    {
      name: 'USUARIO',
      purpose: 'Personas registradas en la plataforma. Email y nombre_usuario son únicos.',
      style: 'core',
      keys: [
        { tag: 'PK', col: 'id_usuario' },
        { tag: 'UQ', col: 'email' },
        { tag: 'UQ', col: 'nombre_usuario' },
        { tag: 'FK', col: 'id_localidad → LOCALIDAD' }
      ],
      relations: [
        { arrow: '↓', target: 'SUSCRIPCION', note: '1:N' },
        { arrow: '↓', target: 'SESION_TRADUCCION', note: '1:N' },
        { arrow: '↓', target: 'COLECCION_PERSONAL', note: '1:N' }
      ]
    },
    {
      name: 'PLAN_SUSCRIPCION',
      purpose: 'Catálogo de planes disponibles: Freemium, Premium Mensual, Premium Anual, Institucional, B2B, Familiar, etc.',
      style: 'core',
      keys: [
        { tag: 'PK', col: 'id_plan' }
      ],
      relations: [
        { arrow: '↓', target: 'SUSCRIPCION', note: '1:N' },
        { arrow: '↓', target: 'AUDITORIA_PRECIOS', note: '1:N' }
      ]
    },
    {
      name: 'SUSCRIPCION',
      purpose: 'Vínculo activo entre un usuario y un plan. Estados: Activa, Vencida, Cancelada.',
      style: 'core',
      keys: [
        { tag: 'PK', col: 'id_suscripcion' },
        { tag: 'FK', col: 'id_usuario → USUARIO' },
        { tag: 'FK', col: 'id_plan → PLAN_SUSCRIPCION' }
      ],
      relations: [
        { arrow: '↓', target: 'FACTURA', note: '1:N' }
      ]
    }
  ],
  ai: [
    {
      name: 'SENA',
      purpose: 'Catálogo de señas reconocibles: código único, significado, categoría (Saludo, Abecedario, Verbo, Sustantivo, Expresión) y ruta del video de validación.',
      style: 'tourism',
      keys: [
        { tag: 'PK', col: 'id_sena' },
        { tag: 'UQ', col: 'codigo' }
      ],
      relations: [
        { arrow: '↔', target: 'SESION_TRADUCCION', note: 'vía SESION_SENA' },
        { arrow: '↔', target: 'COLECCION_PERSONAL', note: 'vía COLECCION_SENA' }
      ]
    },
    {
      name: 'VERSION_MODELO',
      purpose: 'Versiones del modelo de IA desplegadas: texto de versión, fecha de despliegue y notas de mejora.',
      style: 'tourism',
      keys: [
        { tag: 'PK', col: 'id_version' }
      ],
      relations: [
        { arrow: '↓', target: 'SESION_TRADUCCION', note: '1:N' }
      ]
    },
    {
      name: 'PLATAFORMA_ORIGEN',
      purpose: 'Plataformas desde las que se puede usar SignAI: Web App, Zoom Plugin, Google Meet, Teams, WhatsApp Bot, iOS/Android, Desktop, SDK.',
      style: 'tourism',
      keys: [
        { tag: 'PK', col: 'id_plataforma' },
        { tag: 'UQ', col: 'nombre_plataforma' }
      ],
      relations: [
        { arrow: '↓', target: 'SESION_TRADUCCION', note: '1:N' }
      ]
    },
    {
      name: 'SESION_TRADUCCION',
      purpose: 'Registro de cada sesión de traducción: fecha/hora, duración, tipo de salida (Texto/Audio), total de señas detectadas y plataforma usada.',
      style: 'tourism',
      keys: [
        { tag: 'PK', col: 'id_sesion' },
        { tag: 'FK', col: 'id_usuario → USUARIO' },
        { tag: 'FK', col: 'id_version → VERSION_MODELO' },
        { tag: 'FK', col: 'id_plataforma → PLATAFORMA_ORIGEN' }
      ],
      relations: [
        { arrow: '↔', target: 'SENA', note: 'M:N vía SESION_SENA' },
        { arrow: '→', target: 'FEEDBACK_SESION', note: '1:1' },
        { arrow: '↓', target: 'LOG_ERROR', note: '1:N' }
      ]
    },
    {
      name: 'SESION_SENA',
      purpose: 'Tabla puente M:N + dato de calidad: registra cada seña detectada en una sesión junto con su nivel de confianza de reconocimiento (0–100%).',
      style: 'bridge',
      keys: [
        { tag: 'PK', col: '(id_sesion, id_sena)' },
        { tag: 'FK', col: 'id_sesion → SESION_TRADUCCION' },
        { tag: 'FK', col: 'id_sena → SENA' }
      ],
      relations: []
    }
  ],
  billing: [
    {
      name: 'FORMA_PAGO',
      purpose: 'Plan de financiación: Débito Automático Mensual, Pago Anual Adelantado, Abono Prepago Mensual.',
      style: 'billing',
      keys: [{ tag: 'PK', col: 'id_forma' }],
      relations: [{ arrow: '→', target: 'PAGO_FACTURA', note: '1:N' }]
    },
    {
      name: 'MEDIO_PAGO',
      purpose: 'Canal de pago: Tarjeta de Crédito, Tarjeta de Débito, Billetera Virtual, Criptomonedas (USDT).',
      style: 'billing',
      keys: [{ tag: 'PK', col: 'id_medio' }],
      relations: [{ arrow: '→', target: 'PAGO_FACTURA', note: '1:N' }]
    },
    {
      name: 'FACTURA',
      purpose: 'Comprobante fiscal (A/B/C) emitido por una suscripción activa. Acumula el total de líneas de detalle.',
      style: 'billing',
      keys: [
        { tag: 'PK', col: 'id_factura' },
        { tag: 'FK', col: 'id_suscripcion → SUSCRIPCION' }
      ],
      relations: [
        { arrow: '↓', target: 'DETALLE_FACTURA', note: '1:N' },
        { arrow: '↓', target: 'PAGO_FACTURA', note: '1:N' }
      ]
    },
    {
      name: 'DETALLE_FACTURA',
      purpose: 'Líneas de factura: concepto, cantidad, precio unitario y subtotal.',
      style: 'billing',
      keys: [
        { tag: 'PK', col: 'id_detalle' },
        { tag: 'FK', col: 'id_factura → FACTURA' }
      ],
      relations: []
    },
    {
      name: 'PAGO_FACTURA',
      purpose: 'Registro de cada pago parcial o total contra una factura, con forma y medio de pago.',
      style: 'billing',
      keys: [
        { tag: 'PK', col: 'id_pago' },
        { tag: 'FK', col: 'id_factura → FACTURA' },
        { tag: 'FK', col: 'id_forma → FORMA_PAGO' },
        { tag: 'FK', col: 'id_medio → MEDIO_PAGO' }
      ],
      relations: []
    }
  ],
  feedback: [
    {
      name: 'FEEDBACK_SESION',
      purpose: 'Evaluación del usuario sobre una sesión de traducción. Puntuación 1–5 con comentario. Relación 1:1 con SESION_TRADUCCION (id_sesion es UNIQUE).',
      style: 'geo',
      keys: [
        { tag: 'PK', col: 'id_feedback' },
        { tag: 'UQ', col: 'id_sesion' },
        { tag: 'FK', col: 'id_sesion → SESION_TRADUCCION' }
      ],
      relations: []
    },
    {
      name: 'LOG_ERROR',
      purpose: 'Registro de errores técnicos del motor de IA durante una sesión: frames nulos, timeouts, pérdida de landmarks, fallos de hardware, etc.',
      style: 'geo',
      keys: [
        { tag: 'PK', col: 'id_log' },
        { tag: 'FK', col: 'id_sesion → SESION_TRADUCCION' }
      ],
      relations: []
    }
  ],
  extras: [
    {
      name: 'COLECCION_PERSONAL',
      purpose: 'Colecciones de señas organizadas por el usuario. Permite guardar señas favoritas o temáticas en listas personalizadas.',
      style: 'bridge',
      keys: [
        { tag: 'PK', col: 'id_coleccion' },
        { tag: 'FK', col: 'id_usuario → USUARIO' }
      ],
      relations: [
        { arrow: '↔', target: 'SENA', note: 'M:N vía COLECCION_SENA' }
      ]
    },
    {
      name: 'COLECCION_SENA',
      purpose: 'Tabla puente M:N entre COLECCION_PERSONAL y SENA. Guarda la fecha en que se agregó cada seña a la colección.',
      style: 'bridge',
      keys: [
        { tag: 'PK', col: '(id_coleccion, id_sena)' },
        { tag: 'FK', col: 'id_coleccion → COLECCION_PERSONAL' },
        { tag: 'FK', col: 'id_sena → SENA' }
      ],
      relations: []
    },
    {
      name: 'AUDITORIA_PRECIOS',
      purpose: 'Historial automático de cambios de precio en los planes de suscripción. Registra precio anterior, nuevo, fecha y usuario de base de datos que lo modificó.',
      style: 'bridge',
      keys: [
        { tag: 'PK', col: 'id_auditoria' },
        { tag: 'FK', col: 'id_plan → PLAN_SUSCRIPCION' }
      ],
      relations: []
    }
  ],
  bridges: [
    {
      name: 'SESION_SENA',
      purpose: 'M:N → qué señas detectó cada sesión de traducción + nivel de confianza del reconocimiento IA.',
      style: 'bridge',
      keys: [
        { tag: 'PK', col: '(id_sesion, id_sena)' },
        { tag: 'FK', col: 'id_sesion → SESION_TRADUCCION' },
        { tag: 'FK', col: 'id_sena → SENA' }
      ],
      relations: []
    },
    {
      name: 'COLECCION_SENA',
      purpose: 'M:N → qué señas contiene cada colección personal del usuario.',
      style: 'bridge',
      keys: [
        { tag: 'PK', col: '(id_coleccion, id_sena)' },
        { tag: 'FK', col: 'id_coleccion → COLECCION_PERSONAL' },
        { tag: 'FK', col: 'id_sena → SENA' }
      ],
      relations: []
    }
  ]
};

// ── RENDER TABLE CARDS ──
function renderCard(t) {
  const badgeClass = t.style + '-b';
  const badgeLabel = { core: 'Users', geo: 'Geo', tourism: 'IA', billing: 'Billing', bridge: 'Bridge' }[t.style] || t.style;

  let keysHTML = t.keys.map(k => {
    const tagClass = k.tag.toLowerCase();
    return `<div class="key-item"><span class="key-tag ${tagClass}">${k.tag}</span><span class="col-name">${k.col}</span></div>`;
  }).join('');

  let relsHTML = '';
  if (t.relations.length) {
    relsHTML = '<div class="card-relations">' + t.relations.map(r =>
      `<div class="rel-item"><span class="rel-arrow">${r.arrow}</span><span class="rel-target">${r.target}</span><span style="color:var(--text-muted);font-size:10px;margin-left:auto">${r.note}</span></div>`
    ).join('') + '</div>';
  }

  return `<div class="table-card ${t.style}">
    <div class="card-header">
      <span class="card-name">${t.name}</span>
      <span class="card-badge ${badgeClass}">${badgeLabel}</span>
    </div>
    <div class="card-purpose">${t.purpose}</div>
    <div class="card-keys">${keysHTML}</div>
    ${relsHTML}
  </div>`;
}

// Populate all grids
Object.entries(tables).forEach(([group, items]) => {
  const grid = document.getElementById('grid-' + group);
  if (grid) grid.innerHTML = items.map(renderCard).join('');
});

// ═══════════════════════════════════
//  RELATIONSHIPS TAB
// ═══════════════════════════════════

const depChains = [
  {
    title: '📍 Geografía → Usuarios',
    chains: [
      { nodes: [
        { label: 'PROVINCIA', type: 'parent' },
        { label: 'LOCALIDAD', type: '' },
        { label: 'USUARIO', type: 'child' }
      ]}
    ]
  },
  {
    title: '👤 Usuarios & Planes → Suscripción → Facturación',
    chains: [
      { nodes: [
        { label: 'USUARIO', type: 'parent' },
        { label: 'SUSCRIPCION', type: '' },
        { label: 'FACTURA', type: '' },
        { label: 'DETALLE_FACTURA', type: 'child' }
      ]},
      { nodes: [
        { label: 'PLAN_SUSCRIPCION', type: 'parent' },
        { label: 'SUSCRIPCION', type: 'child' }
      ]},
      { nodes: [
        { label: 'FACTURA', type: 'parent' },
        { label: 'PAGO_FACTURA', type: 'child' }
      ]},
      { nodes: [
        { label: 'FORMA_PAGO', type: 'parent' },
        { label: 'PAGO_FACTURA', type: 'child' }
      ]},
      { nodes: [
        { label: 'MEDIO_PAGO', type: 'parent' },
        { label: 'PAGO_FACTURA', type: 'child' }
      ]}
    ]
  },
  {
    title: '🤖 Sesión de Traducción → Señas / Feedback / Logs',
    chains: [
      { nodes: [
        { label: 'USUARIO', type: 'parent' },
        { label: 'SESION_TRADUCCION', type: '' },
        { label: 'FEEDBACK_SESION', type: 'child' }
      ]},
      { nodes: [
        { label: 'VERSION_MODELO', type: 'parent' },
        { label: 'SESION_TRADUCCION', type: 'child' }
      ]},
      { nodes: [
        { label: 'PLATAFORMA_ORIGEN', type: 'parent' },
        { label: 'SESION_TRADUCCION', type: 'child' }
      ]},
      { nodes: [
        { label: 'SESION_TRADUCCION', type: 'parent' },
        { label: 'LOG_ERROR', type: 'child' }
      ]}
    ]
  },
  {
    title: '🌟 Módulo de Mejoras — Colecciones & Auditoría',
    chains: [
      { nodes: [
        { label: 'USUARIO', type: 'parent' },
        { label: 'COLECCION_PERSONAL', type: 'child' }
      ]},
      { nodes: [
        { label: 'PLAN_SUSCRIPCION', type: 'parent' },
        { label: 'AUDITORIA_PRECIOS', type: 'child' }
      ]}
    ]
  }
];

const bridgeRels = [
  { left: 'SESION_TRADUCCION', bridge: 'SESION_SENA', right: 'SENA' },
  { left: 'COLECCION_PERSONAL', bridge: 'COLECCION_SENA', right: 'SENA' }
];

// Render dependency chains
document.getElementById('relMap').innerHTML = depChains.map(group => {
  const chainsHTML = group.chains.map(chain => {
    const nodesHTML = chain.nodes.map((n, i) => {
      const node = `<span class="rel-node ${n.type}">${n.label}</span>`;
      const conn = i < chain.nodes.length - 1 ? '<span class="rel-connector">→</span>' : '';
      return node + conn;
    }).join('');
    return `<div class="rel-chain">${nodesHTML}</div>`;
  }).join('');

  return `<div class="rel-group">
    <div class="rel-group-title">${group.title}</div>
    ${chainsHTML}
  </div>`;
}).join('');

// Render bridge relations
document.getElementById('relBridges').innerHTML = bridgeRels.map(b =>
  `<div class="rel-group">
    <div class="rel-chain">
      <span class="rel-node parent">${b.left}</span>
      <span class="rel-connector">↔</span>
      <span class="rel-node bridge">${b.bridge}</span>
      <span class="rel-connector">↔</span>
      <span class="rel-node child">${b.right}</span>
    </div>
  </div>`
).join('');

// ═══════════════════════════════════
//  LOGIC TAB — Triggers, Procedures, Views
// ═══════════════════════════════════

const triggers = [
  {
    name: 'trg_validar_confianza_ia',
    table: 'SESION_SENA',
    event: 'BEFORE INSERT',
    effect: 'Rechaza cualquier valor de confianza_reconocimiento fuera del rango [0, 100]. Lanza error SQLSTATE 45000.'
  },
  {
    name: 'trg_evitar_borrado_factura_pagada',
    table: 'FACTURA',
    event: 'BEFORE DELETE',
    effect: 'Impide eliminar una factura que ya tiene pagos registrados en PAGO_FACTURA. Protección contra fraude financiero.'
  },
  {
    name: 'trg_fechas_suscripcion_coherentes',
    table: 'SUSCRIPCION',
    event: 'BEFORE INSERT',
    effect: 'Verifica que fecha_fin sea estrictamente posterior a fecha_inicio. Garantiza coherencia temporal en las suscripciones.'
  },
  {
    name: 'trg_prevenir_precio_negativo',
    table: 'PLAN_SUSCRIPCION',
    event: 'BEFORE UPDATE',
    effect: 'Bloquea cualquier actualización que intente fijar precio_mensual en un valor negativo. Protección comercial.'
  },
  {
    name: 'trg_proteger_usuario_facturado',
    table: 'USUARIO',
    event: 'BEFORE DELETE',
    effect: 'Impide eliminar un usuario que tenga facturas emitidas a su nombre (vía SUSCRIPCION → FACTURA). Protección de integridad del historial.'
  },
  {
    name: 'trg_auditar_cambio_precio',
    table: 'PLAN_SUSCRIPCION',
    event: 'AFTER UPDATE',
    effect: 'Detecta cambios en precio_mensual e inserta automáticamente un registro en AUDITORIA_PRECIOS con el precio anterior, el nuevo y el usuario de BD que realizó el cambio.'
  },
  {
    name: 'trg_control_acceso_sesion',
    table: 'SESION_TRADUCCION',
    event: 'BEFORE INSERT',
    effect: 'Consulta la suscripción más reciente del usuario. Si su estado no es "Activa", bloquea el inicio de la sesión de traducción. Control anti-abuso de acceso a la IA.'
  }
];

const procedures = [
  {
    name: 'sp_registrar_error_ia',
    inputs: 'p_id_sesion INT, p_descripcion VARCHAR(255)',
    outputs: 'Inserta un nuevo registro en LOG_ERROR',
    tables: ['LOG_ERROR', 'SESION_TRADUCCION'],
    logic: 'Inserción simplificada de incidentes del motor de IA durante una sesión de traducción.'
  },
  {
    name: 'sp_actualizar_precio_plan',
    inputs: 'p_id_plan INT, p_nuevo_precio DECIMAL(10,2)',
    outputs: 'Actualiza precio_mensual en PLAN_SUSCRIPCION',
    tables: ['PLAN_SUSCRIPCION'],
    logic: 'Actualización masiva de precios de la estructura comercial. Dispara trg_prevenir_precio_negativo y trg_auditar_cambio_precio automáticamente.'
  },
  {
    name: 'sp_cancelar_suscripcion',
    inputs: 'p_id_suscripcion INT',
    outputs: 'Cambia estado a "Cancelada" y fecha_fin a la fecha actual',
    tables: ['SUSCRIPCION'],
    logic: 'Cancelación rápida de suscripción. Registra la baja efectiva con la fecha del día.'
  },
  {
    name: 'sp_registrar_feedback',
    inputs: 'p_id_sesion INT, p_puntuacion INT, p_comentario TEXT',
    outputs: 'Inserta un nuevo FEEDBACK_SESION',
    tables: ['FEEDBACK_SESION'],
    logic: 'Registro rápido de la evaluación del usuario sobre una sesión de traducción (puntuación 1–5).'
  },
  {
    name: 'sp_alta_usuario_freemium',
    inputs: 'p_nombre, p_apellido, p_email, p_nombre_usuario VARCHAR, p_id_localidad INT',
    outputs: 'Inserta USUARIO + SUSCRIPCION Freemium (id_plan = 1)',
    tables: ['USUARIO', 'SUSCRIPCION'],
    logic: 'Alta rápida de usuario asignando automáticamente el plan Freemium por defecto. Usa LAST_INSERT_ID() para encadenar el INSERT de suscripción.'
  },
  {
    name: 'sp_limpieza_logs_antiguos',
    inputs: 'p_dias INT',
    outputs: 'Elimina registros de LOG_ERROR de sesiones más antiguas que p_dias días',
    tables: ['LOG_ERROR', 'SESION_TRADUCCION'],
    logic: 'Mantenimiento preventivo del servidor. Borra errores técnicos de sesiones antiguas para no saturar la base de datos.'
  },
  {
    name: 'sp_facturacion_mensual_masiva',
    inputs: '(sin parámetros)',
    outputs: 'Inserta FACTURAs para todas las suscripciones Activas con precio > 0',
    tables: ['FACTURA', 'SUSCRIPCION', 'PLAN_SUSCRIPCION'],
    logic: 'Generación masiva de facturas mensuales con lógica de ciclos: cobra planes anuales cada 12 meses, trimestrales cada 3 meses, y mensuales cada mes. Ciclo inferido del nombre_plan.'
  }
];

const views = [
  {
    name: 'vista_precision_modelo',
    sources: ['SESION_SENA', 'SESION_TRADUCCION', 'VERSION_MODELO', 'SENA'],
    purpose: 'Reporte de rendimiento de precisión del modelo IA: confianza promedio y cantidad de detecciones por seña y versión.',
    perspective: 'Perspectiva técnica: evaluación de calidad del modelo por versión desplegada.'
  },
  {
    name: 'vista_uso_usuarios',
    sources: ['USUARIO', 'SUSCRIPCION', 'PLAN_SUSCRIPCION', 'SESION_TRADUCCION'],
    purpose: 'Auditoría de consumo de usuarios con suscripción Activa: total de sesiones y minutos consumidos.',
    perspective: '⚠️ Esta view es dropeada en el script (DROP VIEW IF EXISTS). Documentada pero no existe en el estado final de la BD.'
  },
  {
    name: 'vista_senas_mas_utilizadas',
    sources: ['SENA', 'SESION_SENA'],
    purpose: 'Ranking de las señas más utilizadas por la comunidad: código, significado, categoría y total de detecciones.',
    perspective: 'Perspectiva de comunidad: cuáles son las señas más frecuentes para priorizar su optimización en el modelo.'
  },
  {
    name: 'vista_ingresos_mensuales',
    sources: ['FACTURA'],
    purpose: 'Control de facturación total por mes: año, mes, cantidad de facturas emitidas e ingresos totales.',
    perspective: 'Perspectiva financiera: evolución mensual de ingresos para reporting ejecutivo.'
  },
  {
    name: 'vista_errores_plataforma',
    sources: ['LOG_ERROR', 'SESION_TRADUCCION', 'PLATAFORMA_ORIGEN', 'VERSION_MODELO'],
    purpose: 'Historial de errores agrupado por plataforma y versión del modelo: cuántos incidentes ocurrieron en cada combinación.',
    perspective: 'Perspectiva de desarrollo: identificar qué plataforma o versión genera más errores para priorizar correcciones.'
  },
  {
    name: 'vistas_alertas_vencimiento',
    sources: ['USUARIO', 'SUSCRIPCION', 'PLAN_SUSCRIPCION'],
    purpose: 'Muestra usuarios cuya suscripción Activa vence en los próximos 15 días, con días restantes.',
    perspective: 'Perspectiva comercial: alertas de renovación para campañas de retención de clientes.'
  },
  {
    name: 'vista_evolucion_modelos',
    sources: ['VERSION_MODELO', 'SESION_TRADUCCION', 'SESION_SENA'],
    purpose: 'Comparativa de precisión entre versiones del modelo IA: total de sesiones procesadas y confianza global promedio por versión.',
    perspective: 'Perspectiva de I+D: medir el progreso entre versiones del motor de reconocimiento de señas.'
  }
];

// Render triggers
document.getElementById('triggersContainer').innerHTML = triggers.map(t =>
  `<div class="logic-card">
    <div class="logic-header">
      <div class="logic-icon trigger">🔒</div>
      <span class="logic-name">${t.name}</span>
    </div>
    <div class="logic-meta">
      <div class="logic-meta-row"><span class="logic-label">Tabla</span><span class="logic-value"><code>${t.table}</code></span></div>
      <div class="logic-meta-row"><span class="logic-label">Evento</span><span class="logic-value"><code>${t.event}</code></span></div>
      <div class="logic-meta-row"><span class="logic-label">Efecto</span><span class="logic-value">${t.effect}</span></div>
    </div>
  </div>`
).join('');

// Render procedures
document.getElementById('proceduresContainer').innerHTML = procedures.map(p =>
  `<div class="logic-card">
    <div class="logic-header">
      <div class="logic-icon procedure">⚡</div>
      <span class="logic-name">${p.name}</span>
    </div>
    <div class="logic-meta">
      <div class="logic-meta-row"><span class="logic-label">Input</span><span class="logic-value"><code>${p.inputs}</code></span></div>
      <div class="logic-meta-row"><span class="logic-label">Output</span><span class="logic-value">${p.outputs}</span></div>
      <div class="logic-meta-row"><span class="logic-label">Tablas</span><span class="logic-value">${p.tables.map(t => '<code>' + t + '</code>').join(' ')}</span></div>
      <div class="logic-meta-row"><span class="logic-label">Lógica</span><span class="logic-value">${p.logic}</span></div>
    </div>
  </div>`
).join('');

// Render views
document.getElementById('viewsContainer').innerHTML = views.map(v =>
  `<div class="logic-card">
    <div class="logic-header">
      <div class="logic-icon view">👁️</div>
      <span class="logic-name">${v.name}</span>
    </div>
    <div class="logic-meta">
      <div class="logic-meta-row"><span class="logic-label">Fuentes</span><span class="logic-value">${v.sources.map(s => '<code>' + s + '</code>').join(' + ')}</span></div>
      <div class="logic-meta-row"><span class="logic-label">Propósito</span><span class="logic-value">${v.purpose}</span></div>
      <div class="logic-meta-row"><span class="logic-label">Perspectiva</span><span class="logic-value">${v.perspective}</span></div>
    </div>
  </div>`
).join('');
