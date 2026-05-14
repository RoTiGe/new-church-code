Gallery images
==============

Place photos in year-named subfolders, for example:

  public/gallery/2024/easter-service.jpg
  public/gallery/2024/youth-camp.png
  public/gallery/2025/christmas.webp

Rules:
- Each immediate subfolder of public/gallery/ becomes a year tab in the UI.
  The folder name is shown verbatim, so use plain year names: 2023, 2024, 2025.
- Supported file types: .jpg .jpeg .png .webp .gif .avif
- Any other files (e.g. .gitkeep, README.txt, .DS_Store) are ignored.
- After adding or removing images, commit, push, and redeploy on the server.
  (The /api/gallery route reads the filesystem on each request, so no rebuild
  is strictly required, but a deploy is needed to upload new files.)
