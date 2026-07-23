# Just Enjoy Events — Website

This is a plain HTML/CSS/JS website. There's no build step, no server, no
framework to install — you can open `index.html` in a browser right now and
see the whole site.

## What's in this folder

```
site/
├── index.html        Home page
├── about.html        About Us
├── services.html      Services
├── portfolio.html      Portfolio (with filter buttons)
├── team.html          Meet Our Team
├── partners.html       Partner Suppliers
├── blog.html          Wedding Academy (blog + planning timeline)
├── faq.html           FAQ (accordion)
├── contact.html        Contact form + availability checker
├── css/styles.css      Every color, font, spacing rule for the whole site
├── js/main.js         Mobile menu, FAQ accordion, portfolio filters, forms
└── README.md          This file
```

Every page shares the same `css/styles.css` and `js/main.js`, so a change to
either one updates all nine pages at once.

## How to edit text

Open any `.html` file in a plain text editor (VS Code, Notepad++, even
TextEdit/Notepad). Find the sentence you want to change and type over it.
Save, refresh your browser — done. You don't need to touch the CSS or JS
files to change wording.

Example — to change the homepage headline, open `index.html` and find:

```html
<h1>Creating stress-free weddings you'll truly enjoy</h1>
```

Replace the text between the tags.

## How to swap in real photos and videos

Right now, every photo/video slot is a gold placeholder box with a text
label like `data-label="Bride crying"` — that label tells you what to shoot
or upload there. To replace one:

1. Put your image file in a new `images/` folder inside `site/`.
2. Replace the placeholder `<div class="media-block ...">` with:
   ```html
   <img src="images/your-photo.jpg" alt="Describe the photo">
   ```
3. For the homepage hero video, replace the `.hero-media` div similarly with
   a `<video>` tag, or a background image.

Keep photos under ~500KB each (resize/compress before uploading) so the site
stays fast — tools like Squoosh.app or TinyPNG do this for free.

## How to add a new portfolio item

Copy one `<a class="portfolio-item">...</a>` block in `portfolio.html`,
paste it below the others, and edit the text and `data-category` (must be
one of: `church`, `garden`, `indoor`, `elegant`, `intimate`) so it shows up
under the right filter button.

## How to add a new blog post

Copy one `<a class="blog-card">...</a>` block in `blog.html` and edit the
title, tag, and description. For now, clicking a post doesn't open a full
article page — it's a placeholder link (`href="#"`). If you want real blog
post pages, the simplest approach is to duplicate `about.html` as a template
(same header/footer, swap the middle content) for each article, and point
the blog card's `href` to that new file.

## How to edit the FAQ

In `faq.html`, each question is one `.accordion-item` block:

```html
<div class="accordion-item">
  <button class="accordion-q">Your question here <span class="plus">+</span></button>
  <div class="accordion-a"><p>Your answer here.</p></div>
</div>
```

Copy this block to add a question, or delete one to remove it. It opens and
closes automatically — no extra setup needed.

## Making the contact forms actually send you messages

Right now, submitting a form just shows an on-page "thank you" message — it
doesn't go anywhere (there's no server to send it to). Two no-code options:

### Option 1: Formspree (email inbox)
Sign up at formspree.io, get a form endpoint URL, and change the `<form>`
tag to `<form data-demo-form action="https://formspree.io/f/yourcode" method="POST">`.
Submissions land in your email.

### Option 2: Google Forms (spreadsheet of responses) — already wired up

Both forms on `contact.html` (the inquiry form and the availability checker)
are pre-built to submit straight into a Google Form/Sheet. You just need to
connect them to your own form:

**Step 1 — Build the Google Form**
Go to forms.google.com and create a form with fields matching what's on the
site: name, email, phone, wedding date, venue, guests, budget, message (or
just date/venue/guests for the shorter availability checker).

**Step 2 — Find your entry IDs**
Open your live Google Form, right-click → **View Page Source**, and search
(Ctrl/Cmd+F) for `entry.`. Each question has its own ID, like
`entry.1234567890`. Note which ID belongs to which question — the order in
the page source usually matches the order you added them in.

**Step 3 — Find your submit URL**
In that same page source, search for `formResponse`. Copy the full URL, e.g.:
```
https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse
```

**Step 4 — Fill in the placeholders in `contact.html`**
Each form has a `data-google-action` attribute on the `<form>` tag and a
`data-entry` attribute on every field. Replace:
- `data-google-action="REPLACE_WITH_YOUR_FORM_RESPONSE_URL"` → your Step 3 URL
- `data-entry="entry.REPLACE_NAME"` (and similar) → your Step 2 entry IDs

For example, if your "Full name" question's entry ID is `entry.987654321`:
```html
<input id="name" name="name" type="text" required data-entry="entry.987654321">
```

**Step 5 — Test it**
Open `contact.html` in a browser, submit the form, then check your Google
Form's **Responses** tab (or the linked Google Sheet) — your test entry
should appear within a few seconds.

**Special case — "Date" type questions**
If your wedding-date question is set to Google's **Date** question type
(instead of "Short answer"), Google splits it into three hidden fields
instead of one entry ID, named like:
```
entry.259551828_year
entry.259551828_month
entry.259551828_day
```
Both date fields on this site (`#date` and `#avail-date`) already use these
three-part attributes instead of a single `data-entry`:
```html
<input type="date"
       data-entry-year="entry.259551828_year"
       data-entry-month="entry.259551828_month"
       data-entry-day="entry.259551828_day">
```
`main.js` automatically splits the date picker's value (e.g. `2026-07-22`)
into year/month/day and sends all three. Just swap in your own three IDs.

**Notes**
- You can point both forms at the same Google Form (just leave irrelevant
  fields blank when the shorter availability form submits), or create two
  separate Google Forms — whichever is easier for you to manage.
- If a field's `data-entry` still says `REPLACE_...`, that field's answer
  is silently skipped rather than breaking the form — so you can connect
  fields one at a time and test as you go.
- Because Google Forms doesn't allow the page to read a confirmation back,
  the site just trusts the submission worked and shows the thank-you
  message. This is normal for this kind of integration — always double
  check by looking at your actual Google Sheet after testing.

## Colors and fonts (the design system)

Everything visual is controlled by variables at the top of `css/styles.css`:

```css
:root{
  --warm-white:  #F8F6F2;
  --soft-beige:  #EFE5D2;
  --gold:        #B8874F;
  --gold-deep:   #9C6F3C;
  --charcoal:    #2A241E;
  ...
}
```

Change a hex value here and it updates everywhere that color is used, on
every page. The two fonts (Fraunces for headings, Work Sans for body text)
load from Google Fonts automatically — no installation needed.

## How to put this online

This is a static site, so any of these work (roughly easiest to most
flexible):

1. **Netlify Drop** (app.netlify.com/drop) — drag the whole `site` folder
   into the browser, get a live URL in seconds. Free.
2. **GitHub Pages** — push the folder to a GitHub repository, turn on Pages
   in settings. Free, good if you're already using GitHub.
3. **Traditional hosting** (Hostinger, Namecheap, etc.) — upload the folder
   contents via FTP or their file manager into the `public_html` directory.

Once it's live, buy a domain (e.g. justenjoyevents.com) from any registrar
and point it at your host — each host has its own short guide for this
("connect custom domain").

## Things intentionally left as placeholders for you to fill in

- All photos/videos (gold boxes with labels)
- Phone number, email, and address in the footer and contact page
- Team member names, photos, and bios
- Blog post content (titles/descriptions are drafted, full articles are not)
- Google Map embed on the contact page
- Real client testimonials (currently sample quotes)

## Browser support

Built with plain, well-supported CSS and JavaScript — works in current
Chrome, Safari, Firefox, and Edge, and is responsive from phone to desktop
(check the mobile menu by narrowing your browser window).
