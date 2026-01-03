# SFX Memory

A **personal, tag-based sound effect (SFX) memory panel** built for video editors.

SFX Memory helps you collect, recall, and instantly preview sound effects during editing. Instead of rigid category systems, it uses a **flexible tag-based structure** that matches how editors actually think.

---

## 🎯 Purpose

Over time, editors download and accumulate many sound effects. Even when files are renamed, it becomes difficult to remember:

* What this sound was
* Where it was used
* What kind of feeling it created

**SFX Memory** is designed as a personal workflow tool to solve this problem. It doesn’t just store sounds — it helps you **remember why and how you used them**.

---

## ✨ Features

* 🎧 Import mp3 / wav files
* ▶️ Instant one-click playback
* 🏷️ Add and remove unlimited tags
* 📝 Usage notes for each sound
* 🔍 Search by name, tags, and notes
* 🧹 Clean UI without category clutter
* 💾 All data stored locally in the browser
* 🚫 No backend, no accounts, no internet required

---

## 🏷️ Why No Categories?

Fixed categories like Transition or Impact create unnecessary mental overhead during editing.

SFX Memory focuses on a different question:

> “In what context did this sound work well?”

That’s why the system is entirely **tag-based**. Tags are flexible, personal, and adapt to your editing style.

---

## 🚀 Installation & Usage (npm)

### Requirements

* Node.js (LTS recommended)
* npm

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open in your browser:

```
http://localhost:3000
```

*(Port may vary depending on configuration.)*

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Data Storage

Sound names, tags, notes, and duration data are stored **locally only**.

Storage methods:

* JSON / IndexedDB (depending on implementation)

No data is sent anywhere.

---

## 🧠 Project Philosophy

* Personal workflow over generic tools
* Simplicity over feature bloat
* This is a memory aid, not just storage

---

## 📜 License

MIT License

Feel free to use, modify, and share.
