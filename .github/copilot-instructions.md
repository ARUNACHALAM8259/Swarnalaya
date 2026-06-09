<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Swarnalaya Jewelry Website - Project Instructions

## Project Overview
A modern, responsive jewelry website for Swarnalaya featuring premium jewelry collections (Gold, Silver, Diamond, Platinum).

## Project Structure
- `index.html` - Main HTML file with header, search bar, and navigation menu
- `styles.css` - Complete responsive styling
- `script.js` - Interactive functionality for search and navigation
- `logo.png` - Swarnalaya logo (place your logo here)

## Key Features
- Fixed header with logo on right side
- Search bar with camera and microphone icons
- Horizontal navigation menu with 10 jewelry categories
- Fully responsive design (mobile, tablet, desktop)
- Modern color scheme (Teal & Gold)

## Setup Instructions

1. **Add Logo**
   - Place your `logo.png` file in the project root directory
   - Expected size: 200px width (height auto-adjusts)

2. **Open in Browser**
   - Double-click `index.html` or open it in any web browser
   - No server or build tools required

## Customization

### Colors
Edit `:root` variables in `styles.css`:
- `--primary-color: #1a5f4a` (Teal)
- `--secondary-color: #f4d464` (Gold)

### Navigation Items
Edit `.nav-menu` list items in `index.html` to add/remove categories

### Spacing
- Logo to search bar gap: Controlled via `gap: 50px` in `.header-container`
- Adjust `50px` to modify the 2-inch spacing (2 inches ≈ 192px at 96 DPI)

## Next Steps

1. Add product pages for each category
2. Implement product grid/listing
3. Add shopping cart functionality
4. Integrate payment gateway
5. Add product filters and sorting
6. Implement user authentication
7. Create admin dashboard

## Responsive Design Breakpoints
- Desktop: 1024px and above
- Tablet: 768px to 1023px
- Mobile: Below 768px

## Browser Support
Modern browsers (Chrome, Firefox, Safari, Edge - latest versions)

## Notes
- Uses Font Awesome icons (CDN version)
- Custom SVG icons for jewelry items (Earrings, Rings, Gemstone)
- No external dependencies - pure HTML/CSS/JavaScript
