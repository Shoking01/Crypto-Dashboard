/**
 * Componentes de estados de carga
 * Skeleton loaders y spinners
 */

/**
 * Spinner de carga
 */
export function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--accent-blue)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
}

/**
 * Skeleton loader para tarjetas
 */
export function CardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Header skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div
          className="skeleton"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
        <div style={{ flex: 1 }}>
          <div
            className="skeleton"
            style={{ width: '60%', height: 16, borderRadius: 4, marginBottom: 6 }}
          />
          <div
            className="skeleton"
            style={{ width: '40%', height: 12, borderRadius: 4 }}
          />
        </div>
      </div>

      {/* Price skeleton */}
      <div
        className="skeleton"
        style={{ width: '50%', height: 28, borderRadius: 4, marginBottom: '0.75rem' }}
      />

      {/* Footer skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ width: 80, height: 16, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 100, height: 16, borderRadius: 4 }} />
      </div>
    </div>
  );
}

/**
 * Skeleton loader para filas de tabla
 */
export function TableRowSkeleton() {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
      <td style={{ padding: '1rem' }}>
        <div className="skeleton" style={{ width: 30, height: 16, borderRadius: 4 }} />
      </td>
      <td style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }} />
          <div>
            <div
              className="skeleton"
              style={{ width: 120, height: 16, borderRadius: 4, marginBottom: 4 }}
            />
            <div className="skeleton" style={{ width: 60, height: 12, borderRadius: 4 }} />
          </div>
        </div>
      </td>
      <td style={{ padding: '1rem', textAlign: 'right' }}>
        <div className="skeleton" style={{ width: 80, height: 16, borderRadius: 4, marginLeft: 'auto' }} />
      </td>
      <td style={{ padding: '1rem', textAlign: 'right' }}>
        <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 4, marginLeft: 'auto' }} />
      </td>
      <td style={{ padding: '1rem', textAlign: 'right' }}>
        <div className="skeleton" style={{ width: 100, height: 16, borderRadius: 4, marginLeft: 'auto' }} />
      </td>
      <td style={{ padding: '1rem', textAlign: 'right' }}>
        <div className="skeleton" style={{ width: 100, height: 16, borderRadius: 4, marginLeft: 'auto' }} />
      </td>
    </tr>
  );
}

/**
 * Skeleton loader para tabla completa
 */
export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Skeleton loader para gráfico
 */
export function ChartSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '1.5rem',
        height: '400px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div
            className="skeleton"
            style={{ width: 200, height: 24, borderRadius: 4, marginBottom: 8 }}
          />
          <div className="skeleton" style={{ width: 120, height: 16, borderRadius: 4 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            className="skeleton"
            style={{ width: 100, height: 28, borderRadius: 4, marginBottom: 4 }}
          />
          <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 4, marginLeft: 'auto' }} />
        </div>
      </div>

      {/* Chart area */}
      <div
        style={{
          height: '300px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              width: '3%',
              height: `${20 + ((i * 17) % 60)}%`,
              borderRadius: '2px 2px 0 0',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Mensaje de error
 */
export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--accent-red)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '1.5rem',
        }}
      >
        ⚠️
      </div>
      <h3
        style={{
          margin: 0,
          marginBottom: '0.5rem',
          color: 'var(--accent-red)',
          fontSize: '1rem',
        }}
      >
        Error al cargar datos
      </h3>
      <p
        style={{
          margin: 0,
          marginBottom: onRetry ? '1rem' : 0,
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          Intentar nuevamente
        </button>
      )}
    </div>
  );
}

/**
 * Estado vacío
 */
export function EmptyState({ message = 'No hay datos disponibles' }: { message?: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '3rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          opacity: 0.5,
        }}
      >
        📊
      </div>
      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{message}</p>
    </div>
  );
}
