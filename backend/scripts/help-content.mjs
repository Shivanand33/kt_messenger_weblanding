/**
 * Help Center article bodies, keyed by article slug.
 *
 * Written in the markup the website's Help Center renders (see
 * src/pages/Help/helpBody.js): <h2> section headings, <p>, <ul>/<ol>, <strong>,
 * <a href="/help/<slug>"> links between articles, <div class="note"> grey boxes,
 * <section data-tab="..."> platform tabs, and {{download}} / {{qr}} tokens.
 *
 * Loaded by ./import-help-content.mjs, which only fills bodies that are empty
 * or still the seed placeholder — once imported, every article is edited in
 * the admin Help Center.
 */

// Grey "Related Resources" box; each entry is [label, article slug].
const related = (links) => `
<div class="note">
  <h2>Related Resources</h2>
  <ul>
${links.map(([label, slug]) => `    <li><a href="/help/${slug}">${label}</a></li>`).join('\n')}
  </ul>
</div>`

/* ── Download and Installation ─────────────────────────────────────── */

const STORES = {
  Android: { store: 'Google Play Store', url: 'https://play.google.com/store/apps/details?id=com.ogoul.kalamtime', install: ['Scan the QR code above, or open the Google Play Store and search for KT Messenger.', 'Tap Install and wait for the download to finish.'], uninstall: ['Touch and hold the KT Messenger icon on your home screen or in your app drawer.', 'Tap Uninstall (or drag the icon to Uninstall).', 'Tap OK to confirm.'] },
  iOS: { store: 'App Store', url: 'https://apps.apple.com/in/app/kt-messenger/id6478195913', install: ['Scan the QR code above, or open the App Store and search for KT Messenger.', 'Tap Get, then confirm with Face ID, Touch ID or your Apple ID password.'], uninstall: ['Touch and hold the KT Messenger icon on your home screen.', 'Tap Remove App.', 'Tap Delete App, then tap Delete to confirm.'] },
  Mac: { install: ['Click Download for Mac above to see the official download options.', 'Open the downloaded file and move KT Messenger to your Applications folder.'], uninstall: ['Quit KT Messenger.', 'Open Finder and go to Applications.', 'Drag KT Messenger to the Bin, or right-click it and choose Move to Bin.'] },
  Windows: { install: ['Click Download for Windows above to download the KT Messenger installer.', 'Open the downloaded file and follow the on-screen steps to install.'], uninstall: ['Open Start, then go to Settings &gt; Apps &gt; Installed apps.', 'Find KT Messenger in the list and click the ... (more) button next to it.', 'Click Uninstall, then click Uninstall again to confirm.'] },
}

const downloadTab = (tab) => {
  const g = STORES[tab]
  const phone = Boolean(g.store)
  const get = phone
    ? `  <p>Scan the QR code with your phone's camera and tap the link to be taken to the KT Messenger download page on the ${g.store}.</p>
  {{qr}}
  <p>Already on your ${tab} device? <a href="${g.url}">Open KT Messenger on the ${g.store}</a>.</p>`
    : `  <p>Download KT Messenger for your ${tab} computer from the official download options.</p>
  {{download}}`
  return `<section data-tab="${tab}">
${get}
  <ol>
${g.install.map((step) => `    <li>${step}</li>`).join('\n')}
    <li>Open the app and review the Terms of Service, then ${phone ? 'tap' : 'click'} <strong>Agree and continue</strong>.</li>
    <li>${phone ? 'Register your phone number to start chatting.' : 'Follow the on-screen steps to log in to your KT Messenger account.'}</li>
  </ol>
  <h2>Uninstall KT Messenger</h2>
  <p>Uninstalling removes KT Messenger and its chats from this ${tab} device. Back up your chats first if you want to keep them.</p>
  <ol>
${g.uninstall.map((step) => `    <li>${step}</li>`).join('\n')}
  </ol>
</section>`
}

/* ── Get Started: Linked Devices, Troubleshooting, Contacts, Status ─── */

const GET_STARTED = {
  'about-linked-devices': {
    body: `
<p>Linked devices let you use the same KT Messenger account on more than one device. Start a conversation on one device and continue it on another without losing your place.</p>
<h2>Where You Can Use KT Messenger</h2>
<ul>
  <li>Your phone (Android or iPhone), where your account is registered.</li>
  <li>Tablets.</li>
  <li>The KT Messenger desktop apps for Mac and Windows.</li>
  <li>KT Web, in your browser at <a href="https://web.ktmessenger.com/auth/qr">web.ktmessenger.com</a>.</li>
</ul>
<h2>How Linking Works</h2>
<p>You link a device by scanning a QR code with KT Messenger on your phone. Once linked, your chats stay in sync across all of your devices.</p>
<p>You can see and manage every linked device from <strong>Settings &gt; Linked Devices</strong> on your phone.</p>
<p><strong>Note:</strong> Only link devices that you own and trust. If you see a device you don't recognize, log it out right away.</p>
${related([
  ['How to Link a Device', 'how-to-link-a-device'],
  ['Log Out of a Linked Device', 'log-out-of-a-linked-device'],
  ['About Supported Devices', 'about-supported-devices'],
])}`,
  },

  'how-to-link-a-device': {
    body: `
<p>You can link a computer, tablet or browser to your KT Messenger account using your phone.</p>
<h2>Link a Device with a QR Code</h2>
<ol>
  <li>On the device you want to link, open the KT Messenger desktop app or go to <a href="https://web.ktmessenger.com/auth/qr">KT Web</a>. A QR code appears on the screen.</li>
  <li>Open KT Messenger on your phone.</li>
  <li>Go to <strong>Settings &gt; Linked Devices</strong>.</li>
  <li>Point your phone's camera at the QR code on the screen.</li>
</ol>
<p>Your chats will appear on the linked device in a few moments.</p>
<h2>Link with Your Phone Number Instead</h2>
<p>If you can't scan the QR code, choose <strong>Link with phone number instead</strong> on the device you're linking, then enter the code it shows in KT Messenger on your phone.</p>
<h2>If Linking Doesn't Work</h2>
<ul>
  <li>Make sure both devices have an active internet connection.</li>
  <li>Update KT Messenger on your phone to the latest version.</li>
  <li>Refresh the QR code and scan it again.</li>
</ul>
${related([
  ['About Linked Devices', 'about-linked-devices'],
  ['Log Out of a Linked Device', 'log-out-of-a-linked-device'],
  ['How to Download KT Messenger', 'how-to-download-or-uninstall-kt-messenger'],
])}`,
  },

  'log-out-of-a-linked-device': {
    body: `
<p>You can log out of a linked device at any time — for example, a computer you no longer use or a device you don't recognize.</p>
<h2>Log Out from Your Phone</h2>
<ol>
  <li>Open KT Messenger on your phone.</li>
  <li>Go to <strong>Settings &gt; Linked Devices</strong>.</li>
  <li>Tap the device you want to remove.</li>
  <li>Tap <strong>Log out</strong> to confirm.</li>
</ol>
<h2>Log Out on the Linked Device</h2>
<p>You can also log out directly in the KT Messenger desktop app or on KT Web from the app's menu.</p>
<p><strong>Note:</strong> We recommend regularly signing out of devices you no longer use to keep your account secure.</p>
${related([
  ['About Linked Devices', 'about-linked-devices'],
  ['How to Link a Device', 'how-to-link-a-device'],
  ['About Two-Step Verification', 'about-two-step-verification'],
])}`,
  },

  'app-keeps-crashing': {
    body: `
<p>If KT Messenger closes unexpectedly or keeps crashing, these steps usually fix the problem.</p>
<h2>Try These Steps</h2>
<ol>
  <li>Update KT Messenger to the latest version from your app store.</li>
  <li>Restart your device.</li>
  <li>Make sure your device has enough free storage space.</li>
  <li>Check that your device runs a <a href="/help/about-supported-operating-systems">supported operating system</a> and install any available system updates.</li>
  <li>Close other apps that are running in the background.</li>
</ol>
<h2>Still Crashing?</h2>
<p>Reinstalling KT Messenger can fix problems caused by a damaged installation. <a href="/help/how-to-back-up-your-chats">Back up your chats</a> first, then uninstall and install the app again.</p>
<p>If the problem continues, contact KT Messenger Support and include your device model, operating system version, KT Messenger version, and what you were doing when the app closed.</p>
${related([
  ['How to Download or Uninstall KT Messenger', 'how-to-download-or-uninstall-kt-messenger'],
  ['About Supported Devices', 'about-supported-devices'],
  ['How to Back Up Your Chats', 'how-to-back-up-your-chats'],
])}`,
  },

  'notifications-are-not-working': {
    body: `
<p>If you aren't receiving KT Messenger notifications, check the settings below on your device and in the app.</p>
<h2>Check Your Device Settings</h2>
<ul>
  <li>Make sure notifications are allowed for KT Messenger in your device's settings.</li>
  <li>Turn off Do Not Disturb or Focus modes, or allow KT Messenger in them.</li>
  <li>On Android, allow KT Messenger to run in the background and remove it from battery optimization.</li>
  <li>Make sure your device has an active internet connection.</li>
</ul>
<h2>Check KT Messenger</h2>
<ul>
  <li>Open <strong>Settings &gt; Notifications</strong> in KT Messenger and make sure message, group and call notifications are turned on.</li>
  <li>Check whether the chat, group or channel is muted, and unmute it if needed.</li>
  <li>Update KT Messenger to the latest version.</li>
</ul>
<p>If notifications still don't arrive, restart your device and open KT Messenger once so it can reconnect.</p>
${related([
  ['App Keeps Crashing', 'app-keeps-crashing'],
  ["Can't Send Messages", 'can-t-send-messages'],
  ['Muting a Channel', 'muting-a-channel'],
])}`,
  },

  'can-t-send-messages': {
    body: `
<p>If your messages aren't sending, work through these checks.</p>
<h2>Common Causes</h2>
<ul>
  <li><strong>No internet connection:</strong> switch between Wi-Fi and mobile data, or turn Airplane mode on and off.</li>
  <li><strong>Outdated app:</strong> update KT Messenger to the latest version.</li>
  <li><strong>Unfinished registration:</strong> make sure you've <a href="/help/how-to-register-your-phone-number">verified your account</a>.</li>
  <li><strong>Group settings:</strong> in some groups, only admins can send messages.</li>
  <li><strong>Blocked contact:</strong> you can't message a contact you've blocked. Unblock them first.</li>
</ul>
<h2>Still Not Sending?</h2>
<ol>
  <li>Restart KT Messenger.</li>
  <li>Restart your device.</li>
  <li>Make sure your device's date and time are set automatically.</li>
</ol>
<p>If messages still won't send, contact KT Messenger Support.</p>
${related([
  ['How to Send a Message', 'how-to-send-a-message'],
  ['How to Unblock a Contact', 'how-to-unblock-a-contact'],
  ['Notifications Are Not Working', 'notifications-are-not-working'],
])}`,
  },

  'how-to-add-a-contact': {
    body: `
<p>You can chat with anyone who uses KT Messenger. Here's how to add people so you can find them easily.</p>
<h2>Add a Contact by Phone Number</h2>
<ol>
  <li>Save the person's phone number in your phone's contacts, including the country code.</li>
  <li>Open KT Messenger and allow access to your contacts when asked.</li>
  <li>Start a new chat. Contacts who use KT Messenger appear in your list.</li>
</ol>
<h2>Find Someone by Username</h2>
<p>If someone has shared their <a href="/help/about-usernames">username</a> with you, you can search for it to start a chat without needing their phone number.</p>
<p><strong>Note:</strong> A contact only appears in KT Messenger after they have registered an account.</p>
${related([
  ['A Contact Is Not Showing', 'a-contact-is-not-showing'],
  ['About Usernames', 'about-usernames'],
  ['How to Send a Message', 'how-to-send-a-message'],
])}`,
  },

  'a-contact-is-not-showing': {
    body: `
<p>If someone you know isn't showing up in KT Messenger, check the following.</p>
<ul>
  <li>Make sure the person uses KT Messenger and has completed registration.</li>
  <li>Check that their number is saved correctly in your phone's contacts, with the full country code.</li>
  <li>Make sure KT Messenger is allowed to access your contacts in your device's settings.</li>
  <li>Refresh your contact list, or close and reopen KT Messenger.</li>
  <li>Ask whether they have changed their phone number recently.</li>
</ul>
<p>You can also ask them for their <a href="/help/about-usernames">username</a> and search for it instead.</p>
${related([
  ['How to Add a Contact', 'how-to-add-a-contact'],
  ['About Usernames', 'about-usernames'],
  ['Changing Your Number', 'changing-your-number'],
])}`,
  },

  'blocking-a-contact': {
    body: `
<p>If you don't want to hear from someone, you can block them. Blocked contacts can't call you or send you messages.</p>
<h2>What Blocking Does</h2>
<ul>
  <li>The person can no longer message or call you on KT Messenger.</li>
  <li>Blocking doesn't remove the person from your phone's contacts.</li>
  <li>You can unblock the person at any time.</li>
</ul>
<p>If someone is sending you spam or anything that makes you feel unsafe, you can report and block them in one step.</p>
${related([
  ['How to Block a Contact', 'how-to-block-a-contact'],
  ['How to Unblock a Contact', 'how-to-unblock-a-contact'],
  ['Reporting a Problem', 'reporting-a-problem'],
])}`,
  },

  'about-status': {
    body: `
<p>Status lets you share text, photos, videos and voice updates with your contacts. You'll find status updates in the <strong>Updates</strong> tab.</p>
<h2>How Status Works</h2>
<ul>
  <li>Status updates automatically disappear after 24 hours.</li>
  <li>You can share photos, videos of up to 60 seconds per upload, text, and voice updates of up to 30 seconds.</li>
  <li>Status updates are end-to-end encrypted.</li>
  <li>Your contacts can reply to your status privately, and replies arrive in your one-on-one chat.</li>
</ul>
<h2>Who Viewed Your Status</h2>
<p>Tap the eye icon on your status to see who has viewed it. Viewers are shown only when read receipts are turned on.</p>
${related([
  ['How to Post a Status', 'how-to-post-a-status'],
  ['Status Privacy', 'status-privacy'],
  ['Managing Your Privacy', 'managing-your-privacy'],
])}`,
  },

  'how-to-post-a-status': {
    body: `
<p>You can post a photo, video, text or voice status from the <strong>Updates</strong> tab.</p>
<h2>Post a Photo or Video</h2>
<ol>
  <li>Open KT Messenger and go to the <strong>Updates</strong> tab.</li>
  <li>Tap the camera to take a new photo or video, or choose one from your gallery.</li>
  <li>Add a caption if you like.</li>
  <li>Tap <strong>Send</strong> to post it.</li>
</ol>
<p>Each video can be up to 60 seconds long.</p>
<h2>Post a Voice Status</h2>
<ol>
  <li>In the <strong>Updates</strong> tab, tap the microphone icon.</li>
  <li>Press and hold to record for up to 30 seconds.</li>
  <li>Pick a background color.</li>
  <li>Post your voice status.</li>
</ol>
<p>Your status is visible for 24 hours to the people allowed by your <a href="/help/status-privacy">status privacy</a> settings.</p>
${related([
  ['About Status', 'about-status'],
  ['Status Privacy', 'status-privacy'],
])}`,
  },

  'status-privacy': {
    body: `
<p>You choose who can see your status updates.</p>
<h2>Status Privacy Options</h2>
<ul>
  <li><strong>My Contacts:</strong> all of your contacts can see your status. This is the default.</li>
  <li><strong>My Contacts Except...:</strong> all of your contacts except the people you select.</li>
  <li><strong>Only Share With...:</strong> only the contacts you select.</li>
</ul>
<h2>Change Who Can See Your Status</h2>
<ol>
  <li>Open the <strong>Updates</strong> tab.</li>
  <li>Open status <strong>Privacy Settings</strong>.</li>
  <li>Choose an option and select contacts if needed.</li>
</ol>
<p>KT Messenger remembers your choice for your next status updates.</p>
${related([
  ['About Status', 'about-status'],
  ['How to Post a Status', 'how-to-post-a-status'],
  ['Managing Your Privacy', 'managing-your-privacy'],
])}`,
  },
}

/* ── Chats ──────────────────────────────────────────────────────────── */

const CHATS = {
  'how-to-send-a-message': {
    body: `
<p>You can send messages to anyone who uses KT Messenger. Messages in your personal chats are end-to-end encrypted by default.</p>
<h2>Send a Message</h2>
<ol>
  <li>Open KT Messenger.</li>
  <li>Tap the new chat button and choose a contact, or open an existing chat.</li>
  <li>Type your message in the text field.</li>
  <li>Tap <strong>Send</strong>.</li>
</ol>
<h2>Reply and Forward</h2>
<ul>
  <li><strong>Reply:</strong> attaches your message to the exact message you are responding to.</li>
  <li><strong>Forward:</strong> sends a message to another chat in a tap.</li>
</ul>
<h2>Keep Important Chats Close</h2>
<p>You can pin up to 10 important chats to the top of your chat list and star messages to find them later.</p>
${related([
  ['Formatting Your Messages', 'formatting-your-messages'],
  ['Message Reactions', 'message-reactions'],
  ["Can't Send Messages", 'can-t-send-messages'],
])}`,
  },

  'formatting-your-messages': {
    body: `
<p>KT Messenger supports text formatting so you can highlight what matters in your messages.</p>
<h2>Available Formats</h2>
<ul>
  <li>Bold</li>
  <li>Italics</li>
  <li>Strikethrough</li>
  <li>Monospace</li>
  <li>Inline code</li>
  <li>Quotes</li>
  <li>Bullet lists</li>
</ul>
<h2>How to Format Text</h2>
<p>KT Messenger supports markdown syntax. Type the standard markdown symbols around your text before you send it — for example, add two asterisks before and after a word to make it bold.</p>
<p>The formatting appears once the message is sent.</p>
${related([
  ['How to Send a Message', 'how-to-send-a-message'],
  ['Message Reactions', 'message-reactions'],
])}`,
  },

  'message-reactions': {
    body: `
<p>Reactions let you respond to a message quickly without sending a reply. You can react to any message with any emoji from your keyboard.</p>
<h2>React to a Message</h2>
<ol>
  <li>Touch and hold the message.</li>
  <li>Choose an emoji, or open the full emoji keyboard to pick any emoji.</li>
</ol>
<h2>Change or Remove a Reaction</h2>
<p>Touch and hold the message again and choose a different emoji, or tap your current reaction to remove it.</p>
<p>In groups, everyone in the group can see the reactions on a message.</p>
${related([
  ['How to Send a Message', 'how-to-send-a-message'],
  ['Formatting Your Messages', 'formatting-your-messages'],
])}`,
  },

  'sending-photos-and-videos': {
    body: `
<p>Share photos and videos in any chat, in high quality.</p>
<h2>Send Photos or Videos</h2>
<ol>
  <li>Open a chat.</li>
  <li>Tap the attachment icon.</li>
  <li>Choose photos or videos from your gallery, or use the camera to take new ones.</li>
  <li>Add a caption if you like.</li>
  <li>Tap <strong>Send</strong>.</li>
</ol>
<h2>Good to Know</h2>
<ul>
  <li>You can send up to 100 full-resolution photos at once.</li>
  <li>Photos and videos can be sent in HD quality.</li>
  <li>Each attachment can be up to 2 GB.</li>
  <li>With view once, a photo or video disappears after the recipient opens it once.</li>
</ul>
${related([
  ['Sending Documents', 'sending-documents'],
  ['How to Back Up Your Chats', 'how-to-back-up-your-chats'],
])}`,
  },

  'sending-documents': {
    body: `
<p>You can share documents and files — such as PDFs, ZIP files, presentations and code files — in any chat.</p>
<h2>Send a Document</h2>
<ol>
  <li>Open a chat.</li>
  <li>Tap the attachment icon.</li>
  <li>Choose <strong>Document</strong>.</li>
  <li>Select the file you want to send.</li>
  <li>Tap <strong>Send</strong>.</li>
</ol>
<h2>File Size</h2>
<p>Each file can be up to 2 GB. KT Plus subscribers can send attachments of up to 10 GB.</p>
${related([
  ['Sending Photos and Videos', 'sending-photos-and-videos'],
  ["Can't Send Messages", 'can-t-send-messages'],
])}`,
  },

  'how-to-send-a-voice-message': {
    body: `
<p>Voice messages are a quick way to say more than text.</p>
<h2>Record and Send a Voice Message</h2>
<ol>
  <li>Open a chat.</li>
  <li>Press and hold the microphone button and start speaking.</li>
  <li>Release the button to send your voice message.</li>
</ol>
<h2>Listening to Voice Messages</h2>
<ul>
  <li>Voice messages can be played hands free, which is useful while driving, travelling or multitasking.</li>
  <li>You can speed up playback to listen faster.</li>
  <li>KT AI can convert long voice notes into written transcripts.</li>
</ul>
${related([
  ['Playback Speed', 'playback-speed'],
  ['How to Send a Message', 'how-to-send-a-message'],
])}`,
  },

  'playback-speed': {
    body: `
<p>You can listen to voice messages faster by changing the playback speed.</p>
<h2>Change the Playback Speed</h2>
<ol>
  <li>Play a voice message.</li>
  <li>Tap the speed button next to the message to switch between 1x, 1.5x and 2x.</li>
</ol>
<p>You can also drag along the waveform to jump to any part of the message.</p>
${related([
  ['How to Send a Voice Message', 'how-to-send-a-voice-message'],
])}`,
  },

  'about-disappearing-messages': {
    body: `
<p>Disappearing messages are automatically deleted from the chat after the time you choose, for both the sender and the receiver.</p>
<h2>Timer Options</h2>
<ul>
  <li>24 hours</li>
  <li>7 days</li>
  <li>90 days</li>
</ul>
<p>You can also set a default timer so that all of your new chats start with disappearing messages turned on.</p>
<h2>Good to Know</h2>
<ul>
  <li>Messages sent before you turn on disappearing messages are not affected.</li>
  <li>People you chat with can still take screenshots or save media before messages disappear, so only share with people you trust.</li>
</ul>
${related([
  ['Turning It On or Off', 'turning-it-on-or-off'],
  ['Managing Your Privacy', 'managing-your-privacy'],
])}`,
  },

  'turning-it-on-or-off': {
    body: `
<p>You can turn disappearing messages on or off for a single chat, or set a default timer for all new chats.</p>
<h2>For One Chat</h2>
<ol>
  <li>Open the chat.</li>
  <li>Tap the contact or group name to open chat info.</li>
  <li>Tap <strong>Disappearing messages</strong>.</li>
  <li>Choose 24 hours, 7 days or 90 days — or choose <strong>Off</strong> to turn it off.</li>
</ol>
<h2>For All New Chats</h2>
<ol>
  <li>Go to <strong>Settings &gt; Privacy &gt; Disappearing Messages</strong>.</li>
  <li>Tap <strong>Default message timer</strong>.</li>
  <li>Choose a timer, or choose <strong>Off</strong>.</li>
</ol>
${related([
  ['About Disappearing Messages', 'about-disappearing-messages'],
  ['Managing Your Privacy', 'managing-your-privacy'],
])}`,
  },

  'how-to-back-up-your-chats': {
    body: `
<p>Back up your chats so you can restore them if you change or reinstall your phone.</p>
<h2>Where Backups Are Stored</h2>
<ul>
  <li><strong>Android:</strong> your Google Drive.</li>
  <li><strong>iPhone:</strong> your iCloud.</li>
</ul>
<h2>Set Up Chat Backup</h2>
<ol>
  <li>Open KT Messenger and go to <strong>Settings &gt; Chat backup</strong>.</li>
  <li>On Android, tap <strong>Connect Google Drive</strong> and choose your Google account.</li>
  <li>Choose your <strong>Backup frequency</strong>.</li>
  <li>Choose whether to <strong>Back up over Wi-Fi only</strong> and whether to <strong>Include Photos &amp; Videos</strong>.</li>
</ol>
<h2>Encrypted Backups</h2>
<p>Backups are end-to-end encrypted and stored privately in your cloud storage. You can protect them with a custom password or a 64-digit encryption key.</p>
<p><strong>Note:</strong> Keep your backup password or key safe. KT Messenger can't recover it for you, and you'll need it to restore your backup.</p>
${related([
  ['How to Restore a Backup', 'how-to-restore-a-backup'],
  ['How to Download or Uninstall KT Messenger', 'how-to-download-or-uninstall-kt-messenger'],
])}`,
  },

  'how-to-restore-a-backup': {
    body: `
<p>You can restore your chats from a backup when you set up KT Messenger on a new or reinstalled phone.</p>
<h2>Before You Start</h2>
<ul>
  <li>Use the same phone number that was used to create the backup.</li>
  <li>Sign in to the same Google account (Android) or Apple ID (iPhone) that holds the backup.</li>
  <li>Have your backup password or 64-digit key ready if your backup is encrypted.</li>
  <li>Connect to Wi-Fi and keep your phone charged.</li>
</ul>
<h2>Restore Your Chats</h2>
<ol>
  <li>Install KT Messenger and open it.</li>
  <li>Register with your phone number.</li>
  <li>When KT Messenger finds your backup, tap <strong>Restore</strong>.</li>
  <li>Enter your backup password or key if asked.</li>
  <li>Wait for the restore to finish, then continue setting up your profile.</li>
</ol>
${related([
  ['How to Back Up Your Chats', 'how-to-back-up-your-chats'],
  ['How to Register Your Account', 'how-to-register-your-phone-number'],
])}`,
  },
}

/* ── Connect with Businesses ────────────────────────────────────────── */

const BUSINESSES = {
  'about-business-messaging': {
    body: `
<p>Businesses use KT Messenger to talk with their customers — answering questions, sharing products, and sending updates about your orders and bookings.</p>
<h2>What Businesses Can Do</h2>
<ul>
  <li>Show a business profile with their address, hours and website.</li>
  <li>Share a product catalog with photos, prices and descriptions.</li>
  <li>Send greeting and away messages, and use quick replies.</li>
  <li>Send updates such as order confirmations, shipping alerts and appointment reminders.</li>
</ul>
<h2>Your Chats Stay Protected</h2>
<p>Conversations are protected end to end with the KT Encryption Protocol by default.</p>
<p>You're always in control: you can mute, block or report any business.</p>
${related([
  ['How Business Messaging Works', 'how-business-messaging-works'],
  ['Muting a Business', 'muting-a-business'],
  ['Reporting a Business', 'reporting-a-business'],
])}`,
  },

  'how-business-messaging-works': {
    body: `
<p>You can chat with a business the same way you chat with friends.</p>
<h2>Starting a Chat with a Business</h2>
<ul>
  <li>Tap a business's KT link, or scan its QR code.</li>
  <li>Tap an ad that opens a chat with the business.</li>
  <li>Message a business saved in your contacts.</li>
</ul>
<h2>Who You're Talking To</h2>
<p>Small businesses often reply personally using the KT Business app. Larger businesses may use the KT Business Platform, where a team of agents or an automated assistant can answer your messages.</p>
<p>Some replies — such as greeting and away messages — are sent automatically.</p>
<h2>Check the Business Profile</h2>
<p>Open the business profile to see its details. A verified badge shows that the business identity has been verified.</p>
${related([
  ['About Business Messaging', 'about-business-messaging'],
  ['About Verification', 'about-verification'],
  ['Paying a Business', 'paying-a-business'],
])}`,
  },

  'paying-a-business': {
    body: `
<p>Some businesses let you pay for products and services directly in the chat with KT Pay.</p>
<p><strong>Note:</strong> KT Pay may not be available in every country or for every account. If you don't see the payment option in a chat, payments aren't available to you yet.</p>
<h2>Pay a Business</h2>
<ol>
  <li>Open the chat with the business.</li>
  <li>Review the order or request and check the amount.</li>
  <li>Tap the payment option and confirm the payment with your passkey.</li>
</ol>
<p>Both you and the business receive a receipt in the chat.</p>
${related([
  ['Payment Safety', 'payment-safety'],
  ['Payment Receipts', 'payment-receipts'],
  ['How to Send a Payment', 'how-to-send-a-payment'],
])}`,
  },

  'payment-safety': {
    body: `
<p>Follow these tips to pay businesses safely on KT Messenger.</p>
<ul>
  <li>Only pay businesses you know and trust. Check the business profile and look for a verified badge.</li>
  <li>Check the amount and details carefully before you confirm a payment.</li>
  <li>Never share your passkey, PIN or verification codes with anyone — not even someone who says they're from KT Messenger.</li>
  <li>Be cautious of messages that pressure you to pay quickly or offer deals that seem too good to be true.</li>
  <li>Keep your receipts. You'll need them if something goes wrong.</li>
</ul>
<p>If a business asks you to pay in a way that feels suspicious, don't pay — report the business instead.</p>
${related([
  ['Paying a Business', 'paying-a-business'],
  ['Reporting a Business', 'reporting-a-business'],
  ['Avoiding Scams', 'avoiding-scams'],
])}`,
  },

  'muting-a-business': {
    body: `
<p>If a business sends more notifications than you'd like, you can mute its chat. You'll still receive messages, just without notifications.</p>
<h2>Mute a Business Chat</h2>
<ol>
  <li>Open the chat with the business.</li>
  <li>Tap the business name.</li>
  <li>Tap <strong>Mute notifications</strong> and choose how long.</li>
</ol>
<p>To unmute, follow the same steps and turn notifications back on.</p>
<p>If you no longer want messages from the business at all, you can block it.</p>
${related([
  ['Reporting a Business', 'reporting-a-business'],
  ['How to Block a Contact', 'how-to-block-a-contact'],
])}`,
  },

  'reporting-a-business': {
    body: `
<p>Report a business if it sends spam, tries to scam you, or behaves in a way that breaks our rules.</p>
<h2>Report a Business</h2>
<ol>
  <li>Open the chat with the business.</li>
  <li>Tap the business name.</li>
  <li>Tap <strong>Report</strong>. You can also block the business at the same time.</li>
</ol>
<p>Reports help KT Messenger review accounts that misuse the platform.</p>
${related([
  ['Muting a Business', 'muting-a-business'],
  ['Payment Safety', 'payment-safety'],
  ['Reporting a Problem', 'reporting-a-problem'],
])}`,
  },
}

/* ── Voice and Video Calls ──────────────────────────────────────────── */

const CALLS = {
  'how-to-make-a-voice-call': {
    body: `
<p>You can make free voice calls to anyone who uses KT Messenger. Calls are end-to-end encrypted and have no time limit.</p>
<h2>Make a Voice Call</h2>
<ol>
  <li>Open the chat with the person you want to call.</li>
  <li>Tap the phone icon.</li>
</ol>
<h2>Answer or Decline a Call</h2>
<ul>
  <li>Swipe right to answer.</li>
  <li>Swipe left to decline.</li>
  <li>Tap <strong>Reply</strong> to decline with a message.</li>
</ul>
<h2>Clear Sound</h2>
<p>AI noise suppression reduces background sounds such as keyboard clicks and street traffic, and echo cancellation keeps the conversation clear.</p>
${related([
  ['How to Make a Video Call', 'how-to-make-a-video-call'],
  ['Starting a Group Call', 'starting-a-group-call'],
  ["Can't Make Calls", 'can-t-make-calls'],
])}`,
  },

  'how-to-make-a-video-call': {
    body: `
<p>Video calls on KT Messenger support up to 1080p at 60fps and adjust automatically to your connection, even on slower networks.</p>
<h2>Make a Video Call</h2>
<ol>
  <li>Open the chat with the person you want to call.</li>
  <li>Tap the video camera icon.</li>
</ol>
<h2>During a Video Call</h2>
<ul>
  <li>Mute your microphone or turn your camera off at any time.</li>
  <li>Share your screen in high quality.</li>
  <li>Move the call to your Mac, Windows PC or iPad.</li>
</ul>
<p>Video calls are end-to-end encrypted and have no time limit.</p>
${related([
  ['How to Make a Voice Call', 'how-to-make-a-voice-call'],
  ['Call Quality Issues', 'call-quality-issues'],
  ['Starting a Group Call', 'starting-a-group-call'],
])}`,
  },

  'starting-a-group-call': {
    body: `
<p>Group voice and video calls let up to 32 people talk together, with no time limit.</p>
<h2>Start a Call from a Group</h2>
<ol>
  <li>Open the group chat.</li>
  <li>Tap the voice or video call button.</li>
</ol>
<p>Group members receive the call and can join.</p>
<h2>Start a Call with Selected People</h2>
<ol>
  <li>Start a call with one person.</li>
  <li>Add more participants during the call.</li>
</ol>
${related([
  ['Adding People to a Call', 'adding-people-to-a-call'],
  ['About Call Links', 'about-call-links'],
  ['How to Make a Video Call', 'how-to-make-a-video-call'],
])}`,
  },

  'adding-people-to-a-call': {
    body: `
<p>You can add people to a call that's already in progress, up to 32 participants in total.</p>
<h2>Add Someone to a Call</h2>
<ol>
  <li>During the call, tap the add participant button.</li>
  <li>Choose the contacts you want to add.</li>
  <li>Confirm to call them.</li>
</ol>
<p>You can also invite people by sharing a call link.</p>
${related([
  ['Starting a Group Call', 'starting-a-group-call'],
  ['About Call Links', 'about-call-links'],
])}`,
  },

  'about-call-links': {
    body: `
<p>A call link lets people join a voice or video call just by tapping the link.</p>
<h2>How Call Links Work</h2>
<ul>
  <li>Anyone with the link can ask to join the call, so only share it with people you trust.</li>
  <li>People can join from the KT Messenger app, or from a browser on KT Web — nothing to install.</li>
  <li>Group calls can include up to 32 participants.</li>
</ul>
${related([
  ['Creating a Call Link', 'creating-a-call-link'],
  ['Starting a Group Call', 'starting-a-group-call'],
])}`,
  },

  'creating-a-call-link': {
    body: `
<p>Create a call link to invite people to a call without adding them one by one.</p>
<h2>Create and Share a Call Link</h2>
<ol>
  <li>Open the <strong>Calls</strong> tab.</li>
  <li>Tap <strong>Create call link</strong>.</li>
  <li>Choose a voice or video call.</li>
  <li>Share the link in a chat, or copy it to send another way.</li>
</ol>
<p><strong>Note:</strong> Anyone with the link can ask to join, so only share it with the people you want on the call.</p>
${related([
  ['About Call Links', 'about-call-links'],
  ['Adding People to a Call', 'adding-people-to-a-call'],
])}`,
  },

  'call-quality-issues': {
    body: `
<p>KT Messenger adapts call quality to your connection, but a weak network can still cause dropped audio or blurry video. Try these steps.</p>
<ul>
  <li>Move closer to your Wi-Fi router, or switch between Wi-Fi and mobile data.</li>
  <li>Close apps that are using the internet in the background, such as downloads or streaming.</li>
  <li>Update KT Messenger to the latest version.</li>
  <li>Use headphones to reduce echo.</li>
  <li>Make sure nothing is covering your microphone, speaker or camera.</li>
  <li>Restart your device and try the call again.</li>
</ul>
${related([
  ["Can't Make Calls", 'can-t-make-calls'],
  ['How to Make a Video Call', 'how-to-make-a-video-call'],
])}`,
  },

  'can-t-make-calls': {
    body: `
<p>If you can't make or receive calls on KT Messenger, check the following.</p>
<ul>
  <li><strong>Permissions:</strong> allow KT Messenger to use your microphone (and camera for video calls) in your device's settings.</li>
  <li><strong>Connection:</strong> make sure you have an active internet connection.</li>
  <li><strong>App version:</strong> update KT Messenger to the latest version.</li>
  <li><strong>Blocked contacts:</strong> you can't call a contact you've blocked.</li>
  <li><strong>Group size:</strong> a group call can include up to 32 participants.</li>
</ul>
<p>If calls still don't work, restart your device and try again.</p>
${related([
  ['Call Quality Issues', 'call-quality-issues'],
  ['How to Make a Voice Call', 'how-to-make-a-voice-call'],
  ['How to Unblock a Contact', 'how-to-unblock-a-contact'],
])}`,
  },
}

/* ── Communities ────────────────────────────────────────────────────── */

const COMMUNITIES = {
  'what-is-a-community': {
    body: `
<p>A community brings related groups together in one place — for example, a school, a neighborhood or a club — with an announcement channel to reach everyone at once.</p>
<h2>How Communities Work</h2>
<ul>
  <li>A community can include up to 50 groups.</li>
  <li>Each group can have up to 1,024 members.</li>
  <li>Community admins manage the community and send announcements to all members.</li>
  <li>Members only see the groups they have joined.</li>
</ul>
${related([
  ['How to Create a Community', 'how-to-create-a-community'],
  ['Community Guidelines', 'community-guidelines'],
  ['Adding Groups', 'adding-groups'],
])}`,
  },

  'community-guidelines': {
    body: `
<p>Communities work best when everyone feels safe and respected. Follow these guidelines when you create or take part in a community.</p>
<h2>Be Respectful</h2>
<ul>
  <li>Treat other members with respect. Don't harass, bully or threaten anyone.</li>
  <li>Don't share hateful, violent or sexually explicit content.</li>
</ul>
<h2>Keep It Safe</h2>
<ul>
  <li>Don't send spam, scams or misleading links.</li>
  <li>Don't impersonate another person, business or organization.</li>
  <li>Don't share other people's private information without their permission.</li>
</ul>
<h2>For Admins</h2>
<p>Admins are responsible for keeping their community on topic and removing members who break the rules.</p>
<p>You can report members or content that break these guidelines. Accounts that break KT Messenger's rules may be banned.</p>
${related([
  ['What Is a Community', 'what-is-a-community'],
  ['Removing Members', 'removing-members'],
  ['Reporting a Problem', 'reporting-a-problem'],
])}`,
  },

  'how-to-create-a-community': {
    body: `
<p>Create a community to bring your groups together and reach all of your members with announcements.</p>
<h2>Create a Community</h2>
<ol>
  <li>Open KT Messenger and go to <strong>Communities</strong>.</li>
  <li>Tap <strong>New community</strong>.</li>
  <li>Add a community name, a description and a photo.</li>
  <li>Add existing groups or create new ones.</li>
  <li>Tap <strong>Create</strong>.</li>
</ol>
<p>An announcement channel is created automatically so you can message all members at once. You become the community admin.</p>
${related([
  ['What Is a Community', 'what-is-a-community'],
  ['Adding Groups', 'adding-groups'],
  ['Adding Members', 'adding-members'],
])}`,
  },

  'adding-groups': {
    body: `
<p>Community admins can add groups to a community — up to 50 groups in total.</p>
<h2>Add a Group</h2>
<ol>
  <li>Open the community.</li>
  <li>Tap <strong>Add group</strong>.</li>
  <li>Choose an existing group you manage, or create a new group.</li>
</ol>
<p>Members of the community can then find and join the group.</p>
${related([
  ['How to Create a Community', 'how-to-create-a-community'],
  ['Adding Members', 'adding-members'],
])}`,
  },

  'adding-members': {
    body: `
<p>Group and community admins can add members directly or invite them with a link.</p>
<h2>Add Members</h2>
<ol>
  <li>Open the group and tap the group name.</li>
  <li>Tap <strong>Add members</strong>.</li>
  <li>Select contacts and confirm.</li>
</ol>
<h2>Invite with a Link</h2>
<p>Share the group's invite link so people can join on their own. Admins can manage invite links and turn on member approval to review requests before people join.</p>
<p><strong>Note:</strong> People choose who can add them to groups in their privacy settings. If you can't add someone, send them an invite link instead.</p>
${related([
  ['Removing Members', 'removing-members'],
  ['Adding Groups', 'adding-groups'],
  ['Managing Your Privacy', 'managing-your-privacy'],
])}`,
  },

  'removing-members': {
    body: `
<p>Group and community admins can remove members who no longer belong or who break the rules.</p>
<h2>Remove a Member</h2>
<ol>
  <li>Open the group and tap the group name.</li>
  <li>Tap the member you want to remove.</li>
  <li>Tap <strong>Remove</strong> and confirm.</li>
</ol>
<p>Removed members can no longer send or see new messages in the group.</p>
${related([
  ['Adding Members', 'adding-members'],
  ['Community Guidelines', 'community-guidelines'],
])}`,
  },
}

/* ── Channels ───────────────────────────────────────────────────────── */

const CHANNELS = {
  'what-are-channels': {
    body: `
<p>Channels are a one-way broadcast tool: admins share updates with an unlimited audience of followers.</p>
<h2>How Channels Work</h2>
<ul>
  <li>Only channel admins can post. Followers receive the updates.</li>
  <li>You'll find channels in the <strong>Updates</strong> tab.</li>
  <li>Anyone can create a channel for free.</li>
  <li>Organizations can apply for a verified badge.</li>
</ul>
<p><strong>Note:</strong> Channel updates are encrypted in transit. Unlike your personal chats, they are not end-to-end encrypted, because channels are designed to reach a large audience.</p>
${related([
  ['How to Follow a Channel', 'how-to-follow-a-channel'],
  ['Channel Privacy', 'channel-privacy'],
  ['How to Create a Channel', 'how-to-create-a-channel'],
])}`,
  },

  'channel-privacy': {
    body: `
<p>Following a channel keeps your personal information private.</p>
<h2>As a Follower</h2>
<ul>
  <li>Channel admins can't see your phone number, profile photo or name.</li>
  <li>Other followers can't see that you follow the channel.</li>
</ul>
<h2>As an Admin</h2>
<p>Channel admins can turn on automatic clearing so that channel updates are removed after 30 days.</p>
${related([
  ['What Are Channels', 'what-are-channels'],
  ['How to Follow a Channel', 'how-to-follow-a-channel'],
  ['Managing Your Privacy', 'managing-your-privacy'],
])}`,
  },

  'how-to-follow-a-channel': {
    body: `
<p>Follow channels to get updates from the people and organizations you care about.</p>
<h2>Follow a Channel</h2>
<ol>
  <li>Open the <strong>Updates</strong> tab.</li>
  <li>Browse or search for a channel.</li>
  <li>Tap <strong>Follow</strong>.</li>
</ol>
<p>You can also follow a channel by tapping its invite link.</p>
<h2>Unfollow a Channel</h2>
<p>Open the channel, tap the channel name, then tap <strong>Unfollow</strong>.</p>
${related([
  ['Muting a Channel', 'muting-a-channel'],
  ['What Are Channels', 'what-are-channels'],
])}`,
  },

  'muting-a-channel': {
    body: `
<p>Mute a channel to keep following it without getting notifications for every update.</p>
<h2>Mute a Channel</h2>
<ol>
  <li>Open the channel.</li>
  <li>Tap the channel name.</li>
  <li>Tap <strong>Mute notifications</strong>.</li>
</ol>
<p>Updates still appear in the channel. To unmute, follow the same steps and turn notifications back on.</p>
${related([
  ['How to Follow a Channel', 'how-to-follow-a-channel'],
  ['Notifications Are Not Working', 'notifications-are-not-working'],
])}`,
  },

  'how-to-create-a-channel': {
    body: `
<p>Anyone can create a channel on KT Messenger for free.</p>
<h2>Create a Channel</h2>
<ol>
  <li>Open the <strong>Updates</strong> tab.</li>
  <li>Tap the add button and choose <strong>New channel</strong>.</li>
  <li>Add a channel name, a description and a photo.</li>
  <li>Tap <strong>Create</strong>.</li>
</ol>
<h2>Manage Your Channel</h2>
<ul>
  <li>Add co-admins to help you post.</li>
  <li>Schedule posts in advance.</li>
  <li>See detailed reach analytics for your updates.</li>
</ul>
${related([
  ['Posting Updates', 'posting-updates'],
  ['What Are Channels', 'what-are-channels'],
])}`,
  },

  'posting-updates': {
    body: `
<p>Channel admins can share text, photos, videos, links and more with all followers.</p>
<h2>Post an Update</h2>
<ol>
  <li>Open your channel.</li>
  <li>Type your message or attach a photo, video or file.</li>
  <li>Tap <strong>Send</strong> to post it, or schedule it for later.</li>
</ol>
<h2>Tips</h2>
<ul>
  <li>Use post scheduling to share updates at the best time for your audience.</li>
  <li>Check reach analytics to see how your updates perform.</li>
  <li>Keep your updates relevant, and follow the community guidelines.</li>
</ul>
${related([
  ['How to Create a Channel', 'how-to-create-a-channel'],
  ['Community Guidelines', 'community-guidelines'],
])}`,
  },
}

/* ── Privacy, Safety, and Security ──────────────────────────────────── */

const PRIVACY = {
  'managing-your-privacy': {
    body: `
<p>KT Messenger gives you control over who can see your information and who can contact you. You'll find these options in <strong>Settings &gt; Privacy</strong>.</p>
<h2>Who Can See My Personal Info</h2>
<ul>
  <li><strong>Last seen and Online</strong></li>
  <li><strong>Profile photo</strong></li>
</ul>
<p>For each one, choose <strong>Everyone</strong>, <strong>My contacts</strong>, <strong>My contacts except...</strong> or <strong>Nobody</strong>.</p>
<h2>More Privacy Controls</h2>
<ul>
  <li><strong>Groups:</strong> choose who can add you to groups — Everyone, My Contacts, or My Contacts Except.</li>
  <li><strong>Status:</strong> choose who can see your status updates.</li>
  <li><strong>Read receipts:</strong> decide whether others see when you've read their messages.</li>
  <li><strong>Disappearing messages:</strong> set a default timer for new chats.</li>
  <li><strong>Chat lock:</strong> hide private chats in a Locked Chats folder that opens with Face ID, your fingerprint or a secret passcode.</li>
  <li><strong>Silence unknown callers:</strong> calls from unknown numbers appear in your call log without ringing.</li>
</ul>
${related([
  ['Last Seen and Online', 'last-seen-and-online'],
  ['Status Privacy', 'status-privacy'],
  ['How to Block a Contact', 'how-to-block-a-contact'],
])}`,
  },

  'last-seen-and-online': {
    body: `
<p>You choose who can see when you're online and when you last used KT Messenger.</p>
<h2>Change Your Last Seen and Online Settings</h2>
<ol>
  <li>Go to <strong>Settings &gt; Privacy</strong>.</li>
  <li>Tap <strong>Last seen and online</strong>.</li>
  <li>Choose who can see your last seen: <strong>Everyone</strong>, <strong>My contacts</strong>, <strong>My contacts except...</strong> or <strong>Nobody</strong>.</li>
  <li>Choose who can see when you're online.</li>
</ol>
${related([
  ['Managing Your Privacy', 'managing-your-privacy'],
  ['Status Privacy', 'status-privacy'],
])}`,
  },

  'how-to-block-a-contact': {
    body: `
<p>Block a contact to stop them from calling you or sending you messages.</p>
<h2>Block a Contact</h2>
<ol>
  <li>Open the chat with the contact.</li>
  <li>Tap the contact's name.</li>
  <li>Tap <strong>Block</strong> and confirm.</li>
</ol>
<p>If the contact is sending spam or making you feel unsafe, tap <strong>Report &amp; Block</strong> to report them at the same time.</p>
<p>Blocking doesn't remove the person from your phone's contacts.</p>
${related([
  ['How to Unblock a Contact', 'how-to-unblock-a-contact'],
  ['Blocking a Contact', 'blocking-a-contact'],
  ['Reporting a Problem', 'reporting-a-problem'],
])}`,
  },

  'how-to-unblock-a-contact': {
    body: `
<p>You can unblock a contact at any time.</p>
<h2>Unblock a Contact</h2>
<ol>
  <li>Open the chat with the blocked contact.</li>
  <li>Tap the contact's name.</li>
  <li>Tap <strong>Unblock</strong>.</li>
</ol>
<p>After you unblock someone, they can call you and send you messages again.</p>
${related([
  ['How to Block a Contact', 'how-to-block-a-contact'],
  ['Blocking a Contact', 'blocking-a-contact'],
])}`,
  },

  'about-two-step-verification': {
    body: `
<p>Two-step verification is an optional security feature that adds an extra layer of protection to your account.</p>
<h2>How It Works</h2>
<p>When two-step verification is on, you'll need your 6-digit PIN — or your passkey with biometrics — in addition to your verification code when you sign in to your account on a new device.</p>
<p>This keeps your account protected even if someone gains access to your verification code.</p>
<h2>Keep Your PIN Safe</h2>
<ul>
  <li>Choose a PIN that's hard to guess.</li>
  <li>Never share your PIN with anyone.</li>
</ul>
<p><strong>Note:</strong> KT Messenger Support will never ask for your PIN or verification code.</p>
${related([
  ['Turning It On', 'turning-it-on'],
  ['About Registration and Two-Step Verification', 'about-registration-and-two-step-verification'],
  ['Avoiding Scams', 'avoiding-scams'],
])}`,
  },

  'turning-it-on': {
    body: `
<p>Turn on two-step verification to add a PIN to your account.</p>
<h2>Turn On Two-Step Verification</h2>
<ol>
  <li>Open KT Messenger and go to <strong>Settings &gt; Account</strong>.</li>
  <li>Tap <strong>Two-step verification</strong>.</li>
  <li>Tap <strong>Turn on</strong>.</li>
  <li>Enter a 6-digit PIN, then enter it again to confirm.</li>
</ol>
<p>You'll be asked for this PIN when you sign in to your account on a new device. You can change your PIN or turn two-step verification off from the same screen.</p>
${related([
  ['About Two-Step Verification', 'about-two-step-verification'],
  ['About Registration and Two-Step Verification', 'about-registration-and-two-step-verification'],
])}`,
  },

  'avoiding-scams': {
    body: `
<p>Scammers may try to trick you into sharing your codes, sending money or clicking harmful links. Here's how to stay safe.</p>
<h2>Warning Signs</h2>
<ul>
  <li>Messages that pressure you to act quickly.</li>
  <li>Requests for your verification code, PIN or passkey.</li>
  <li>A friend asking for money from a new number.</li>
  <li>Offers, prizes or deals that seem too good to be true.</li>
</ul>
<h2>Protect Yourself</h2>
<ul>
  <li>Never share your verification code, PIN or passkey. KT Messenger Support will never ask for them.</li>
  <li>Be cautious with links, especially from people you don't know.</li>
  <li>Check with friends or family in another way before sending money.</li>
  <li>Turn on <a href="/help/turning-it-on">two-step verification</a>.</li>
  <li>Silence unknown callers in your privacy settings.</li>
</ul>
<p>If something feels wrong, block and report the account.</p>
${related([
  ['Reporting a Problem', 'reporting-a-problem'],
  ['How to Block a Contact', 'how-to-block-a-contact'],
  ['About Two-Step Verification', 'about-two-step-verification'],
])}`,
  },

  'reporting-a-problem': {
    body: `
<p>Let us know when something goes wrong, so we can help and keep KT Messenger safe.</p>
<h2>Report an Account</h2>
<ol>
  <li>Open the chat with the account.</li>
  <li>Tap the contact, group or business name.</li>
  <li>Tap <strong>Report</strong>. You can block the account at the same time.</li>
</ol>
<h2>Report a Problem with the App</h2>
<p>Contact KT Messenger Support and describe the problem. Include your device model, operating system version, KT Messenger version, and the steps that lead to the problem.</p>
<h2>Report a Security Issue</h2>
<p>If you've found a security vulnerability, contact KT Messenger Support with a security disclosure. Security reports are reviewed within one business day.</p>
${related([
  ['Avoiding Scams', 'avoiding-scams'],
  ['How to Block a Contact', 'how-to-block-a-contact'],
  ['Reporting a Business', 'reporting-a-business'],
])}`,
  },
}

/* ── Accounts and Account Bans ──────────────────────────────────────── */

const ACCOUNTS = {
  'changing-your-number': {
    body: `
<p>If you get a new phone number, you can move your KT Messenger account to it.</p>
<h2>Before You Start</h2>
<ul>
  <li>Make sure your new phone number can receive calls or messages.</li>
  <li>Make sure you still have access to the email address on your account, as a verification code will be sent to it.</li>
</ul>
<h2>Change Your Number</h2>
<ol>
  <li>Go to <strong>Settings &gt; Account</strong>.</li>
  <li>Tap <strong>Change number</strong>.</li>
  <li>Enter your old number and your new number.</li>
  <li>Follow the on-screen steps to verify your new number.</li>
</ol>
<p>Your chats, groups and settings stay with your account.</p>
${related([
  ['How to Register Your Account', 'how-to-register-your-phone-number'],
  ['Updating Your Profile', 'updating-your-profile'],
])}`,
  },

  'updating-your-profile': {
    body: `
<p>Your profile helps people recognize you on KT Messenger.</p>
<h2>Update Your Profile</h2>
<ol>
  <li>Go to <strong>Settings</strong>.</li>
  <li>Tap your name or profile photo.</li>
  <li>Change your name, profile photo, about, or <a href="/help/about-usernames">username</a>.</li>
</ol>
<p>You can choose who can see your profile photo in your <a href="/help/managing-your-privacy">privacy settings</a>.</p>
${related([
  ['About Usernames', 'about-usernames'],
  ['Managing Your Privacy', 'managing-your-privacy'],
])}`,
  },

  'how-to-delete-your-account': {
    body: `
<p>Deleting your account is permanent and cannot be undone.</p>
<h2>Before You Delete</h2>
<ul>
  <li>If you only want to stop using KT Messenger on one device, <a href="/help/how-to-download-or-uninstall-kt-messenger">uninstall the app</a> instead.</li>
  <li>If you want to keep your chats, <a href="/help/how-to-back-up-your-chats">back them up</a> first.</li>
</ul>
<h2>Delete Your Account</h2>
<ol>
  <li>Go to <strong>Settings &gt; Account</strong>.</li>
  <li>Tap <strong>Delete account</strong>.</li>
  <li>Enter your phone number to confirm.</li>
  <li>Tap <strong>Delete account</strong>.</li>
</ol>
${related([
  ['What Happens When You Delete', 'what-happens-when-you-delete'],
  ['How to Back Up Your Chats', 'how-to-back-up-your-chats'],
])}`,
  },

  'what-happens-when-you-delete': {
    body: `
<p>When you delete your KT Messenger account:</p>
<ul>
  <li>Your account is deleted and can't be restored.</li>
  <li>Your message history is deleted from your device.</li>
  <li>You're removed from all of your groups and communities.</li>
  <li>Your profile, username and settings are removed.</li>
</ul>
<p>If you want to use KT Messenger again later, you'll need to register a new account.</p>
${related([
  ['How to Delete Your Account', 'how-to-delete-your-account'],
  ['How to Register Your Account', 'how-to-register-your-phone-number'],
])}`,
  },

  'about-banned-accounts': {
    body: `
<p>KT Messenger may ban accounts that break our Terms of Service, to keep the platform safe for everyone.</p>
<h2>Common Reasons for a Ban</h2>
<ul>
  <li>Sending spam or unwanted bulk messages.</li>
  <li>Scams, fraud or phishing.</li>
  <li>Impersonating another person, business or organization.</li>
  <li>Harassment, threats or sharing harmful content.</li>
</ul>
<p>If you believe your account was banned by mistake, you can request a review.</p>
${related([
  ['Requesting a Review', 'requesting-a-review'],
  ['Community Guidelines', 'community-guidelines'],
])}`,
  },

  'requesting-a-review': {
    body: `
<p>If you think your account was banned or locked by mistake, you can ask us to review it.</p>
<h2>Request a Review</h2>
<ol>
  <li>Contact KT Messenger Support and choose account support.</li>
  <li>Include the phone number linked to your account.</li>
  <li>Briefly explain why you believe the ban is a mistake.</li>
</ol>
<p>Our account support team usually replies within 24 hours. Please send one request only — sending several doesn't speed up the review.</p>
${related([
  ['About Banned Accounts', 'about-banned-accounts'],
  ['Reporting a Problem', 'reporting-a-problem'],
])}`,
  },
}

/* ── Payments ───────────────────────────────────────────────────────── */

const AVAILABILITY = '<p><strong>Note:</strong> KT Pay may not be available in every country or for every account. If you don\'t see the payment option in KT Messenger, payments aren\'t available to you yet.</p>'

const PAYMENTS = {
  'how-to-send-a-payment': {
    body: `
<p>With KT Pay you can send money to your contacts right from a chat.</p>
${AVAILABILITY}
<h2>Send a Payment</h2>
<ol>
  <li>Open the chat with a contact who uses KT Pay.</li>
  <li>Tap the payment icon.</li>
  <li>Enter the amount.</li>
  <li>Check the details, then confirm with your passkey.</li>
</ol>
<p>Both you and the recipient receive a receipt in the chat.</p>
<p><strong>Note:</strong> A payment can't be cancelled once it has been completed, so always check the recipient and the amount before you confirm.</p>
${related([
  ['Adding a Payment Method', 'adding-a-payment-method'],
  ['Payment Receipts', 'payment-receipts'],
  ['Keeping Payments Secure', 'keeping-payments-secure'],
])}`,
  },

  'adding-a-payment-method': {
    body: `
<p>Before you can send payments, add a payment method to KT Pay.</p>
${AVAILABILITY}
<h2>Add a Payment Method</h2>
<ol>
  <li>Open KT Pay in KT Messenger.</li>
  <li>Tap <strong>Add payment method</strong>.</li>
  <li>Choose a supported method, such as a bank account or card.</li>
  <li>Follow the on-screen steps to verify it.</li>
</ol>
<p>Only add payment methods that belong to you.</p>
${related([
  ['How to Send a Payment', 'how-to-send-a-payment'],
  ['Keeping Payments Secure', 'keeping-payments-secure'],
])}`,
  },

  'viewing-your-history': {
    body: `
<p>You can see every payment you've sent and received in KT Pay.</p>
${AVAILABILITY}
<h2>View Your Payment History</h2>
<ol>
  <li>Open KT Pay in KT Messenger.</li>
  <li>Go to your activity.</li>
  <li>Tap a payment to see its details and receipt.</li>
</ol>
<p>Where available, you can export your history as a CSV or PDF file for your records.</p>
${related([
  ['Payment Receipts', 'payment-receipts'],
  ['Reporting an Issue', 'reporting-an-issue'],
])}`,
  },

  'payment-receipts': {
    body: `
<p>Every completed KT Pay payment comes with a receipt.</p>
${AVAILABILITY}
<h2>Where to Find Receipts</h2>
<ul>
  <li>A copy of the receipt is delivered into the chat where the payment was made.</li>
  <li>You can also open any payment from your KT Pay activity to see its receipt.</li>
</ul>
<p>Receipts show the amount, the date and the status of the payment. Keep your receipts — you'll need them if you have to report an issue.</p>
${related([
  ['Viewing Your History', 'viewing-your-history'],
  ['Reporting an Issue', 'reporting-an-issue'],
])}`,
  },

  'keeping-payments-secure': {
    body: `
<p>KT Pay is designed to keep your money safe. Every payment must be approved with your passkey.</p>
<h2>Tips to Stay Secure</h2>
<ul>
  <li>Never share your passkey, PIN or verification codes with anyone.</li>
  <li>Only send money to people and businesses you know and trust.</li>
  <li>Check the recipient and the amount before you confirm.</li>
  <li>Pay attention to scam warnings shown in the app.</li>
  <li>Be cautious of messages that pressure you to pay quickly.</li>
</ul>
<p>If you think someone has accessed your account or payment, report it right away.</p>
${related([
  ['Reporting an Issue', 'reporting-an-issue'],
  ['Avoiding Scams', 'avoiding-scams'],
  ['Payment Safety', 'payment-safety'],
])}`,
  },

  'reporting-an-issue': {
    body: `
<p>If a payment went wrong — for example, it was sent to the wrong person or for the wrong amount — here's what to do.</p>
<h2>Raise a Dispute</h2>
<ol>
  <li>Open the payment's receipt.</li>
  <li>Choose the option to raise a dispute.</li>
  <li>Describe what happened.</li>
</ol>
<p>A completed payment can't be reversed by one side alone, so raise a dispute as soon as possible.</p>
<h2>Contact Support</h2>
<p>You can also contact KT Messenger Support about a payment that went wrong. Our account support team usually replies within 24 hours. Include the payment details from your receipt.</p>
${related([
  ['Payment Receipts', 'payment-receipts'],
  ['Keeping Payments Secure', 'keeping-payments-secure'],
])}`,
  },
}

/* ── KT for Business ────────────────────────────────────────────────── */

const KT_BUSINESS = {
  'about-the-business-app': {
    body: `
<p>The KT Business app is a free app for small business owners who manage customer conversations on their phone.</p>
<h2>Features</h2>
<ul>
  <li><strong>Product catalog:</strong> show your products and services with images, prices and descriptions.</li>
  <li><strong>Business profile:</strong> add your address, hours, website and a verified business identity.</li>
  <li><strong>Away and greeting messages:</strong> reply automatically when you're busy, or welcome new customers instantly.</li>
  <li><strong>Quick replies and labels:</strong> answer common questions in a tap and organize your chats.</li>
</ul>
<h2>Free to Start</h2>
<p>The Business app is free and runs on the phone you already use, with 1,000 service conversations every month.</p>
${related([
  ['Setting Up Your Catalog', 'setting-up-your-catalog'],
  ['About the Business Platform', 'about-the-business-platform'],
  ['About Verification', 'about-verification'],
])}`,
  },

  'setting-up-your-catalog': {
    body: `
<p>A catalog lets customers browse your products and services right inside KT Messenger.</p>
<h2>Set Up Your Catalog</h2>
<ol>
  <li>Open the KT Business app.</li>
  <li>Go to your business tools and open <strong>Catalog</strong>.</li>
  <li>Add a product or service with a photo, name, price and description.</li>
  <li>Save it, then repeat for your other products.</li>
</ol>
<h2>Tips</h2>
<ul>
  <li>Use clear photos and short, accurate descriptions.</li>
  <li>Keep prices and availability up to date.</li>
  <li>Share your catalog, your KT link or your QR code with customers.</li>
</ul>
${related([
  ['About the Business App', 'about-the-business-app'],
  ['About Business Messaging', 'about-business-messaging'],
])}`,
  },

  'about-the-business-platform': {
    body: `
<p>The KT Business Platform is a programmable messaging platform for medium and large businesses — to send notifications, run customer support and automate conversations at scale.</p>
<h2>What's Included</h2>
<ul>
  <li>A REST and webhook API, with SDKs for Node.js, Python, PHP, Java and Go.</li>
  <li>Message templates that are approved once and reused across campaigns.</li>
  <li>Automation and chatbots connected to your own systems and CRM.</li>
  <li>A shared team inbox with assignments, labels and internal notes.</li>
  <li>Delivery and engagement analytics.</li>
  <li>End-to-end encryption with the KT Encryption Protocol by default.</li>
</ul>
<h2>Pricing</h2>
<p>The first 1,000 service conversations every month are free. A conversation is a 24-hour message thread, and pricing is billed separately per region.</p>
${related([
  ['Getting Started', 'getting-started'],
  ['About the Business App', 'about-the-business-app'],
  ['About Verification', 'about-verification'],
])}`,
  },

  'getting-started': {
    body: `
<p>Send your first message over the KT Business Platform in a few steps.</p>
<ol>
  <li><strong>Create a developer account:</strong> sign up for KT Business and open the developer console.</li>
  <li><strong>Generate an API key:</strong> create a scoped API key and connect a sandbox number to test with.</li>
  <li><strong>Send your first message:</strong> use a code sample or SDK to send a test message and confirm delivery.</li>
  <li><strong>Set up webhooks:</strong> point a webhook URL at your server to receive incoming messages and status events.</li>
  <li><strong>Go live:</strong> register your production number, submit your message templates for approval, and switch to your production keys.</li>
</ol>
<p>The sandbox lets you send a test message right away, and you can rotate your API keys at any time.</p>
${related([
  ['About the Business Platform', 'about-the-business-platform'],
  ['How to Get Verified', 'how-to-get-verified'],
])}`,
  },

  'about-verification': {
    body: `
<p>A verified badge shows customers that a business's identity has been verified by KT Messenger.</p>
<h2>Why Verification Matters</h2>
<ul>
  <li>Customers can trust that they're talking to the real business.</li>
  <li>It helps protect your customers from people who impersonate your brand.</li>
</ul>
<p>Not every business qualifies for verification.</p>
<p><strong>Note:</strong> Impersonating another business is not allowed on KT Messenger. If you see a fake business account, report it.</p>
${related([
  ['How to Get Verified', 'how-to-get-verified'],
  ['Reporting a Business', 'reporting-a-business'],
])}`,
  },

  'how-to-get-verified': {
    body: `
<p>Businesses and organizations can apply for a verified badge.</p>
<h2>Before You Apply</h2>
<ul>
  <li>Register your business with your business phone number.</li>
  <li>Complete your business profile: name, logo, category, address, hours and website.</li>
  <li>Make sure the details match your official business information.</li>
</ul>
<h2>Apply for Verification</h2>
<p>Submit a verification request for your business account. KT Messenger reviews each request, and the badge appears on your profile if it's approved.</p>
<p><strong>Note:</strong> Not every business qualifies, and a verified badge can be removed if a business breaks KT Messenger's rules.</p>
${related([
  ['About Verification', 'about-verification'],
  ['About the Business App', 'about-the-business-app'],
])}`,
  },
}

export const HELP_CONTENT = {
  'how-to-download-or-uninstall-kt-messenger': {
    platforms: ['Android', 'iOS', 'Mac', 'Windows'],
    body: `
<h2>Download KT Messenger</h2>
${['Android', 'iOS', 'Mac', 'Windows'].map(downloadTab).join('\n')}
<p>You can reinstall KT Messenger at any time by following the download steps above.</p>`,
  },

  'about-supported-operating-systems': {
    body: `
<p>Currently, KT Messenger supports the following operating systems:</p>
<ul>
  <li>Android 10.0 and later</li>
  <li>iOS 16.6 and later</li>
  <li>iPadOS 16.6 and later</li>
  <li>macOS 13.5 and later (Mac devices with Apple Silicon)</li>
  <li>visionOS 1.0 and later</li>
</ul>
<p>Once you have a supported device, download KT Messenger from the appropriate app store and complete the registration process using your phone number.</p>
<p><strong>Note:</strong> An internet connection is required during registration and verification. We recommend keeping your device and KT Messenger updated to the latest available version.</p>
<h2>How We Choose What to Support</h2>
<p>Devices and operating systems change over time, so we regularly review the versions supported by KT Messenger.</p>
<p>Older operating systems may not support the latest security updates, bug fixes, or features available in newer versions of KT Messenger.</p>
<h2>What Happens If Your Operating System Is No Longer Supported</h2>
<p>If your operating system is no longer supported, you may not be able to install or update KT Messenger.</p>
<p>To continue using KT Messenger, update your device to a supported operating system version.</p>
<p>We update this article whenever our supported operating system requirements change.</p>`,
  },

  'about-supported-devices': {
    platforms: ['Android', 'iOS'],
    body: `
<p>KT Messenger works on supported Android and Apple devices.</p>
<section data-tab="Android">
  <h2>Android</h2>
  <p>Supported Android devices include:</p>
  <ul>
    <li>Android phones running Android 10.0 and later.</li>
    <li>Android devices with access to the Google Play Store.</li>
    <li>Android devices with an active internet connection.</li>
  </ul>
</section>
<section data-tab="iOS">
  <h2>Apple Devices</h2>
  <p>Supported Apple devices include:</p>
  <ul>
    <li>iPhones running iOS 16.6 and later.</li>
    <li>iPads running iPadOS 16.6 and later.</li>
    <li>Mac devices running macOS 13.5 and later with Apple Silicon (M1 or later).</li>
    <li>Apple Vision devices running visionOS 1.0 and later.</li>
  </ul>
</section>
<p>We regularly review the devices and operating systems supported by KT Messenger.</p>
<p>As technology evolves, older devices and operating systems may no longer support the latest KT Messenger features, security updates, and performance improvements.</p>
<p>If support for your device or operating system changes, we'll update this article with the latest requirements.</p>
<div class="note">
  <h2>Related Resources</h2>
  <p><a href="/help/about-supported-operating-systems">About Supported Operating Systems</a></p>
</div>`,
  },

  /* ── Registration ────────────────────────────────────────────────── */

  'how-to-register-your-phone-number': {
    body: `
<h2>How to Register Your Account</h2>
<p>To use KT Messenger, you must register with a valid phone number and email address.</p>
<p>During registration, a verification code will be sent to your email address to verify your account. The verification code is unique and changes each time you register a new account or sign in on a new device.</p>
<h2>Registration Requirements</h2>
<p>Before registering your account, make sure that:</p>
<ul>
  <li>You are using the <a href="/help/how-to-download-or-uninstall-kt-messenger">latest version</a> of KT Messenger.</li>
  <li>You have a <a href="/help/about-supported-devices">supported device</a> and <a href="/help/about-supported-operating-systems">operating system</a>.</li>
  <li>You have a valid phone number.</li>
  <li>You have access to a valid email address.</li>
  <li>Your device has an active internet connection.</li>
</ul>
<h2>Register Your Account</h2>
<ol>
  <li>Open KT Messenger.</li>
  <li>Select your country or region.</li>
  <li>Enter your phone number.</li>
  <li>Enter your email address.</li>
  <li>Tap <strong>Continue</strong>.</li>
  <li>Check your email inbox for the verification code.</li>
  <li>Enter the verification code in KT Messenger.</li>
  <li>Complete your profile setup.</li>
</ol>
<p>Once registration is complete, you can start using KT Messenger.</p>
<h2>Didn't Receive the Verification Code?</h2>
<p>If you don't receive the verification code:</p>
<ul>
  <li>Verify that your email address was entered correctly.</li>
  <li>Check your Spam or Junk folder.</li>
  <li>Wait a few minutes and request a new code.</li>
  <li>Make sure your device has an active internet connection.</li>
</ul>
<p>If you're still unable to receive the verification code, contact KT Messenger Support for assistance.</p>
<h2>Keep Your Account Secure</h2>
<p>Never share your verification code with anyone.</p>
<p><strong>Note:</strong> KT Messenger Support will never ask for your verification code.</p>
${related([
  ['About Supported Devices', 'about-supported-devices'],
  ['About Supported Operating Systems', 'about-supported-operating-systems'],
  ['How to Update KT Messenger', 'how-to-download-or-uninstall-kt-messenger'],
])}`,
  },

  'about-registration-and-two-step-verification': {
    body: `
<p>When you create a KT Messenger account, you'll go through two different security steps: account registration and two-step verification.</p>
<h2>Registration</h2>
<p>Registration is required to create a new KT Messenger account or sign in on a new device.</p>
<p>To register your account, you'll need to provide your phone number and email address. A verification code will be sent to your email address to confirm your identity.</p>
<p>The verification code is unique and changes each time you register a new account or sign in on a new device.</p>
<p>Verifying your account is the only way to activate KT Messenger and access your messages and contacts.</p>
<p>Learn more in <a href="/help/how-to-register-your-phone-number">How to Register Your Account</a>.</p>
<h2>Two-Step Verification</h2>
<p>Two-step verification is an optional security feature that helps protect your KT Messenger account from unauthorized access.</p>
<p>When enabled, you'll be asked to enter an additional verification code or security credential when signing in to your account on a new device.</p>
<p>This extra layer of security helps keep your account protected even if someone gains access to your email address or device.</p>
<h2>Keep Your Account Secure</h2>
<p>To help keep your account safe:</p>
<ul>
  <li>Never share your verification code with anyone.</li>
  <li>Do not share your password or security credentials.</li>
  <li>Use a secure email address that only you can access.</li>
  <li>Keep KT Messenger updated to the latest version.</li>
</ul>
<p><strong>Note:</strong> KT Messenger Support will never ask for your verification code, password, or security credentials.</p>
<h2>Forgot Your Verification Information?</h2>
<p>If you're unable to complete verification or access your account, contact KT Messenger Support for assistance.</p>
${related([
  ['How to Register Your Account', 'how-to-register-your-phone-number'],
  ['How to Enable Two-Step Verification', 'turning-it-on'],
  ['How to Protect Your Account', 'avoiding-scams'],
])}`,
  },

  /* ── Usernames ───────────────────────────────────────────────────── */

  'about-usernames': {
    body: `
<p>A username helps people find and connect with you on KT Messenger without sharing your phone number.</p>
<p>Your username is unique to your account and can be shared with others so they can easily find you on KT Messenger.</p>
<h2>Username Requirements</h2>
<p>When creating a username:</p>
<ul>
  <li>Usernames must be unique.</li>
  <li>Usernames can contain letters, numbers, underscores (_), and periods (.).</li>
  <li>Usernames cannot contain spaces.</li>
  <li>Usernames cannot impersonate another person, business, or organization.</li>
</ul>
<h2>Changing Your Username</h2>
<p>You can update your username from your account settings if username changes are available for your account.</p>
<p>If you change your username, people may need to use your new username to find you on KT Messenger.</p>
${related([
  ['How to Create a KT Messenger Account', 'how-to-register-your-phone-number'],
  ['About Privacy Settings', 'managing-your-privacy'],
  ['Managing Your Profile Information', 'updating-your-profile'],
])}`,
  },

  ...GET_STARTED,
  ...CHATS,
  ...BUSINESSES,
  ...CALLS,
  ...COMMUNITIES,
  ...CHANNELS,
  ...PRIVACY,
  ...ACCOUNTS,
  ...PAYMENTS,
  ...KT_BUSINESS,
}
