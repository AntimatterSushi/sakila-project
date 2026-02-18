// frontend/src/ui/styles.js
export const styles = {
  headerCenter: { textAlign: 'center', flex: 1 },
  page: {
    minHeight: '100vh',
    background: '#110c977a',
    color: '#ee8f13',
    padding: '28px 18px'
  },
  header: {
    maxWidth: 1100,
    margin: '0 auto 18px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  title: { margin: 0, fontSize: 32, letterSpacing: 0.2, fontFamily: 'Impact' },
  subtitle: { margin: '6px 0 0 0', opacity: 0.8 },
  headerActions: { display: 'flex', alignItems: 'center', gap: 12 },
  grid: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 14
  },
  card: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10
  },
  cardTitle: { margin: 1, fontSize: 30, fontFamily: 'Impact', letterSpacing: '0.08em' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.06)'
  },
  itemMain: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  itemLink: {
    color: '#e9ecf1',
    textDecoration: 'none',
    fontWeight: 650,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  itemMeta: { fontSize: 12, opacity: 0.8 },
  smallButton: {
    fontSize: 12,
    padding: '8px 10px',
    borderRadius: 10,
    textDecoration: 'none',
    color: '#e9ecf1',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)'
  },
  primaryButton: {
    border: 'none',
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
    background: '#6366f1',
    color: 'white'
  },
  ghostButton: {
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
    background: 'transparent',
    color: '#e9ecf1',
    border: '1px solid rgba(255,255,255,0.18)'
  },
  error: {
    maxWidth: 1100,
    margin: '0 auto 14px auto',
    padding: 12,
    borderRadius: 12,
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.25)'
  },
  customerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    flexWrap: 'wrap'
  },
  scrollBox: {
    maxHeight: 340,
    overflowY: 'auto',
    paddingRight: 6
  },
  input: {
    padding: 10,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(0,0,0,0.25)',
    color: '#e9ecf1'
  }
}