# Project Change Notes

This file explains the updates made in the app and why they were needed.

## 1) Data moved out of component file
- File updated: App.js
- New file: resList.js
- What changed:
  - Restaurant data object was moved from App.js into resList.js.
  - App.js now imports data from resList.js.
- Why this helps:
  - Keeps component code clean and easier to read.
  - Makes data reusable in other components later.

## 2) Import/export mismatch fixed
- File updated: App.js
- File referenced: resList.js
- What changed:
  - App.js import was aligned with the export pattern used in resList.js.
- Why this helps:
  - Prevents runtime issues where imported values are undefined.
  - Ensures data is available for rendering cards.

## 3) Card rendering from data list fixed
- File updated: App.js
- What changed:
  - Restaurant cards are rendered from the restaurant list.
  - Map rendering uses a proper return with a stable key.
- Why this helps:
  - Ensures each card actually renders.
  - Fixes issues where component code did not run because map returned nothing.

## 4) Prop usage in card component cleaned up
- File updated: App.js
- What changed:
  - ResCard now receives restData and extracts fields from restData.info.
  - Cuisines are displayed with comma + space formatting.
- Why this helps:
  - Makes each card show correct dynamic data.
  - Improves text readability for cuisines.

## 5) Header and card layout CSS corrected
- File updated: index.css
- What changed:
  - Header container border was corrected and alignment improved.
  - Card spacing and sizing were adjusted for better layout balance.
  - Image sizing was fixed so image does not consume the whole card body.
- Why this helps:
  - Prevents visual breakage in the grid.
  - Keeps content visible under card images.

## 6) Card text styling improved
- Files updated: App.js, index.css
- What changed:
  - Added semantic classes for card text elements.
  - Added dedicated typography and spacing styles.
  - Added clamp behavior for long cuisine lines.
- Why this helps:
  - Cleaner visual hierarchy.
  - Prevents long text from making cards look crowded.

## Net Result
- Data is modular.
- Cards render reliably from the dataset.
- Card text is easier to read.
- Layout is stable and cleaner on the restaurant grid.
