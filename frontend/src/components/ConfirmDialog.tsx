interface Props {
  title: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm">
        <h3 className="mb-4 font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="btn-danger">Confirm</button>
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  )
}
