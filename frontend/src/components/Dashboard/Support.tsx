export default function Support() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Support</h2>

      <div className="card space-y-3">
        <p>If you need help, reach us via:</p>
        <a href="mailto:deadong170@gmail.com" className="link">deadong170@gmail.com</a>
        <a href="https://discord.gg/QXnXwYgMXp" target="_blank" rel="noreferrer" className="link">Join Discord</a>

        <h3 className="font-semibold mt-4">Common FAQs</h3>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>How to upload a script? → Use the Upload button in Script Storage.</li>
          <li>What is premium? → Premium scripts require whitelist.</li>
          <li>How to whitelist? → Select a premium script in Key System.</li>
          <li>Loader not working? → Ensure you are in a public Roblox game.</li>
        </ul>
      </div>
    </div>
  )
}
