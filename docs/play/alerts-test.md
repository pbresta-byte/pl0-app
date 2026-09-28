# Android alerts — real-phone test checklist

Use a dedicated test install and synthetic birth details. Do not clear data from a phone that contains a personal chart. Record the phone model, Android version, app version, language, and outcome for each run.

## First-use disclosure and permissions

- [ ] Fresh install starts with alerts off and shows no permission prompt.
- [ ] In English, enable alerts and tap **Schedule now**. The PL0 explanation appears before Android's notification prompt. It names the alert types, says scheduling stays on the phone, and explains how to turn alerts off.
- [ ] Repeat in Spanish and check the same information appears in Spanish.
- [ ] Choose **Not now**. No Android permission prompt appears and no alert is scheduled. Tap **Schedule now** again; the Android prompt may appear only after the explanation has already been shown.
- [ ] Choose **Continue**, then deny notification permission. PL0 reports that permission was not granted, does not schedule notifications, and remains usable. Confirm the OS does not show a prompt on every subsequent attempt after denial.
- [ ] Grant notification permission in Android Settings, return to PL0, and tap **Schedule now**. Confirm the app schedules alerts and reports the schedule horizon.
- [ ] Tap **Send a test alert** and confirm it appears. Turn alerts off under **Options → Alerts**; confirm pending PL0 alerts are cancelled and no further PL0 alert arrives.

## Exact-alarm access

On Android 12 or later:

- [ ] Allow notifications but leave **Alarms & reminders** access off. Schedule alerts and confirm the in-app hint says timing may be a few minutes late.
- [ ] Tap **Allow exact timing**. Confirm the PL0 explanation has appeared before the system settings screen. Grant access, return to PL0, and confirm the hint clears and alerts are rescheduled.
- [ ] Deny or back out of the exact-alarm settings screen. Confirm PL0 keeps the in-app hint, does not crash, and leaves alerts scheduled inexactly where Android permits that fallback.

## Delivery and rescheduling

- [ ] **Doze:** schedule a test alert a few minutes ahead, unplug the phone, leave PL0 in the background, turn the screen off, and let the phone enter Doze. Record whether the alert arrives and how late it is, with exact-alarm access both on and off.
- [ ] **Reboot:** schedule a test alert, reboot the phone, unlock it, and confirm the notification plugin restores pending alerts. Verify an upcoming alert arrives once, not twice.
- [ ] **Time zone:** schedule an upcoming alert, change the phone's time zone, then reopen PL0 and tap **Schedule now**. Confirm the displayed and delivered time matches the newly calculated local schedule; note whether the old pending alert was replaced.
- [ ] **DST:** on a test phone or emulator, schedule alerts on both sides of a daylight-saving transition. Confirm no alert is duplicated or lost and that PL0's schedule after reopening uses the device's new local time.
- [ ] Repeat one delivery check in English and Spanish; notification title and body use the selected language.

## Results

| Run | Phone / Android | App version / language | Scenario | Result / notes |
|---|---|---|---|---|
| 1 |  |  | First-use disclosure and denied permission |  |
| 2 |  |  | Exact-alarm access off and on |  |
| 3 |  |  | Doze and reboot |  |
| 4 |  |  | Time-zone change and DST |  |
