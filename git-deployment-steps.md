# 🚀 Git Push और Website Host करने के Steps

## 📋 Pre-Requirements
- Git installed on your computer
- GitHub account (free)
- Your website files ready

## 🔧 Step 1: Git Setup (One-time only)

### Install Git (if not installed):
1. Download from: https://git-scm.com/download/win
2. Install with default settings
3. Open Command Prompt or Git Bash

### Configure Git:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

## 🌐 Step 2: Create GitHub Repository

1. **Go to GitHub.com**
2. **Sign up/Login** to your account
3. **Click "New Repository"** (green button)
4. **Repository Settings:**
   - Repository name: `hardikamakeover.github.io`
   - Description: "Hardika Makeover - Professional Makeup Artist Website"
   - Public (must be public for free GitHub Pages)
   - ✅ Add README file
5. **Click "Create Repository"**

## 💻 Step 3: Push Your Files to Git

### Method A: Using Command Line (Recommended)

1. **Open Command Prompt** in your website folder
2. **Initialize Git:**
```bash
git init
```

3. **Add all files:**
```bash
git add .
```

4. **Commit files:**
```bash
git commit -m "Initial commit - Hardika Makeover website"
```

5. **Connect to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/hardikamakeover.github.io.git
```
*Replace YOUR_USERNAME with your actual GitHub username*

6. **Push to GitHub:**
```bash
git branch -M main
git push -u origin main
```

### Method B: Using GitHub Desktop (Easier)

1. **Download GitHub Desktop:** https://desktop.github.com/
2. **Install and login** with your GitHub account
3. **Clone your repository:**
   - File → Clone Repository
   - Select: hardikamakeover.github.io
   - Choose local folder
4. **Copy your website files** to the cloned folder
5. **Commit changes:**
   - Write commit message: "Add Hardika Makeover website"
   - Click "Commit to main"
6. **Push to GitHub:**
   - Click "Push origin"

### Method C: Direct Upload (Simplest)

1. **Go to your GitHub repository**
2. **Click "uploading an existing file"**
3. **Drag and drop all your files:**
   - index.html
   - styles.css
   - script.js
   - image-crop-config.js
   - assets/ folder (drag the whole folder)
4. **Commit changes:**
   - Write: "Add Hardika Makeover website files"
   - Click "Commit changes"

## 🌐 Step 4: Enable GitHub Pages

1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Scroll down to "Pages"** in left sidebar
4. **Configure Pages:**
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
5. **Click "Save"**

## ✅ Step 5: Your Website is Live!

- **Your website URL:** `https://YOUR_USERNAME.github.io/hardikamakeover.github.io`
- **Or if repo name is exactly:** `https://hardikamakeover.github.io`
- **Live in:** 5-10 minutes

## 🔄 Step 6: Update Your Website (Future)

### To update your website later:

**Method 1 - Command Line:**
```bash
git add .
git commit -m "Updated website content"
git push
```

**Method 2 - GitHub Desktop:**
1. Make changes to files
2. Open GitHub Desktop
3. Write commit message
4. Click "Commit to main"
5. Click "Push origin"

**Method 3 - Direct Edit:**
1. Go to GitHub repository
2. Click on file to edit
3. Click pencil icon
4. Make changes
5. Commit changes

## 🎯 Quick Commands Reference

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/hardikamakeover.github.io.git
git push -u origin main

# Future updates
git add .
git commit -m "Updated content"
git push
```

## 🔧 Troubleshooting

### If you get errors:

**Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/hardikamakeover.github.io.git
```

**Error: "failed to push"**
```bash
git pull origin main --allow-unrelated-histories
git push
```

**Error: "permission denied"**
- Check your GitHub username/password
- Use GitHub Desktop instead

## 📱 Custom Domain Setup (Optional)

### To use hardikamakeover.com:

1. **Buy domain** from GoDaddy/Namecheap
2. **In GitHub repository:**
   - Settings → Pages
   - Custom domain: `hardikamakeover.com`
   - Save
3. **Update DNS** at domain provider:
   - Add CNAME record: `www` → `hardikamakeover.github.io`
   - Add A records for apex domain:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

## 🎉 Success Checklist

- [ ] GitHub repository created
- [ ] Files pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Website accessible at GitHub URL
- [ ] All images loading correctly
- [ ] Slider working properly
- [ ] Mobile responsive
- [ ] Contact form functional

## 📞 Need Help?

### Common Issues:
1. **Images not showing:** Check file paths in assets/images/
2. **Slider not working:** Ensure all JS files are uploaded
3. **404 error:** Wait 10 minutes, GitHub Pages takes time
4. **CSS not loading:** Check file names match exactly

### Support Resources:
- GitHub Pages Documentation
- GitHub Community Forum
- YouTube tutorials: "GitHub Pages hosting"

## 🚀 Your Website Will Be Live At:
`https://hardikamakeover.github.io`

**Congratulations! Your professional makeup artist website is now live on the internet! 🎉**
