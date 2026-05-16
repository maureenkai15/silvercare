export async function sendWhatsApp(to: string, message: string) {
  const res = await fetch('/api/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message })
  })
  return res.json()
}

export async function alertFamily(elderName: string, issue: string, familyPhone: string) {
  const message = `🏥 *SilverCare Alert*\n\nYour loved one *${elderName}* needs attention.\n\n⚠️ ${issue}\n\nPlease check in with them soon.\n\n_Sent by SilverCare Singapore_`
  return sendWhatsApp(familyPhone, message)
}

export async function morningCheckIn(elderName: string, phone: string) {
  const message = `☀️ Good morning, ${elderName}!\n\nThis is your SilverCare daily check-in. How are you feeling today?\n\nReply with:\n✅ *Good* — feeling well\n😐 *Okay* — so-so\n😔 *Not good* — need help`
  return sendWhatsApp(phone, message)
}

export async function medicationReminder(elderName: string, medication: string, phone: string) {
  const message = `💊 *Medication Reminder*\n\nHi ${elderName}, time to take your *${medication}*!\n\nReply *Done* when you've taken it. 👍`
  return sendWhatsApp(phone, message)
}
