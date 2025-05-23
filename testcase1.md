# Test Case: Verify All Links on Astar Financial Website

## Objective
To verify that all links on the Astar Financial website are functional, handle dropdown menus, and measure response times.

## Precondition
- The Astar Financial website is accessible at `https://astarfinancial.com.au/`.
- The Playwright test environment is set up.

## Steps
1. Launch the browser and navigate to the homepage (`https://astarfinancial.com.au/`).
2. Fetch or read the link structure from the website.
3. For each dropdown menu:
   - Hover over the parent dropdown.
   - Verify that the dropdown expands.
4. For each child link:
   - Verify that the link is interactable.
   - Click the link and measure the response time.
   - Verify that the page loads successfully and the title is not empty.
   - Navigate back to the homepage.

## Expected Results
- All dropdown menus expand when hovered over.
- All child links are interactable and functional.
- The response time for each link is logged.
- The page title for each link is verified to be non-empty.
- The browser navigates back to the homepage after testing each link.