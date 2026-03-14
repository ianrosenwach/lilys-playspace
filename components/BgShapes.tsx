export default function BgShapes() {
  return (
    <>
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{ width: 160, height: 160, background: '#FFE8F7', top: 20, left: -40 }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{ width: 100, height: 100, background: '#E0FFF5', top: 60, right: -20 }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{ width: 70, height: 70, background: '#FFF8DC', bottom: 200, left: 80 }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{ width: 55, height: 55, background: '#E8E0FF', bottom: 300, right: 60 }}
      />
    </>
  )
}
