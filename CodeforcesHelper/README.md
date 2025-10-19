# Codeforces Solution Helper

Quick access to the best (fastest) solutions for Codeforces problems, sorted by execution time.

## Features

- 🏆 **Best Solutions** - Adds a button to view fastest solutions
- ⚡ **Sorted by Time** - Solutions ordered by consumed time (fastest first)
- 🎯 **Smart Detection** - Works on both contest and problemset pages
- 🔗 **One-Click Access** - Direct link to status page with filters
- 💻 **Clean UI** - Integrates seamlessly with Codeforces interface

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click on Tampermonkey icon → Create a new script
3. Copy the contents of `CodeforcesHelper.user.js`
4. Paste into the editor and save (Ctrl+S)

## Usage

### On Problem Pages

1. Visit any Codeforces problem:
   - Contest: `https://codeforces.com/contest/[ID]/problem/[A-Z]`
   - Problemset: `https://codeforces.com/problemset/problem/[ID]/[A-Z]`

2. Look for the **"Best Solutions"** button added to the main menu

3. Click to view solutions sorted by execution time (fastest first)

### What You Get

- ✅ All accepted solutions
- ✅ Sorted by consumed time (lowest to highest)
- ✅ Language breakdown
- ✅ User profiles
- ✅ Submission timestamps

## How It Works

The script:
1. Detects when you're on a Codeforces problem page
2. Extracts the problem ID and letter (A, B, C, etc.)
3. Adds a button to the navigation menu
4. Links to the status page with filters:
   - Problem ID
   - Problem letter
   - Sorted by consumed time (ascending)

## URL Formats Supported

### Contest Problems
```
codeforces.com/contest/1234/problem/A
→ Links to: /problemset/status/1234/problem/A?order=BY_CONSUMED_TIME_ASC
```

### Problemset Problems
```
codeforces.com/problemset/problem/1234/A
→ Links to: /problemset/status/1234/problem/A?order=BY_CONSUMED_TIME_ASC
```

## Use Cases

Perfect for:
- 📚 **Learning** - Study optimal solutions after solving
- 🏃 **Speed Coding** - Learn from fastest implementations
- 🔍 **Debugging** - Compare your approach with accepted solutions
- 💡 **Optimization** - Find the most efficient algorithms
- 🎓 **Competitive Programming** - Improve your problem-solving skills

## Benefits

### For Learning:
- See how top programmers solve problems efficiently
- Learn new tricks and optimizations
- Understand time-complexity improvements

### For Practice:
- Verify your solution approach
- Discover alternative methods
- Benchmark your execution time

### For Competition:
- Quick access during contests (after solving)
- Learn from fastest submissions
- Improve time management

## Compatibility

- ✅ Chrome / Chromium / Edge
- ✅ Firefox
- ✅ Safari (with Tampermonkey)
- ✅ Opera

**Site:** `codeforces.com`

## Version

- **Current:** v1.1
- **Author:** Pravesh Pandey
- LinkedIn: [pravesh25](https://www.linkedin.com/in/pravesh25/)

## Screenshots

**Before:**
```
Problem Menu: [Problem] [Submit] [Status] ...
```

**After:**
```
Problem Menu: [Problem] [Submit] [Status] [Best Solutions] ...
                                            ^^^^^ New Button!
```

## Tips

1. **After Solving:** Use this to see if your solution is optimal
2. **During Learning:** Study different approaches and implementations
3. **Language Specific:** Filter by your preferred language on the status page
4. **Time Analysis:** Compare your time with the fastest solutions

## Example Workflow

1. Solve a problem (e.g., Contest 1234, Problem A)
2. Submit your solution
3. Click "Best Solutions" button
4. See solutions sorted from fastest to slowest
5. Study top 3-5 solutions
6. Learn new optimization techniques
7. Apply to future problems!

## Ethical Use

⚠️ **Important Guidelines:**

✅ **DO:**
- Use to learn after solving yourself
- Study for understanding algorithms
- Compare approaches after contests
- Learn optimization techniques

❌ **DON'T:**
- Copy solutions during active contests
- Submit others' code as your own
- Use before attempting the problem
- Violate Codeforces honor code

**Remember:** The goal is to improve your problem-solving skills, not to copy solutions!

## Troubleshooting

**Button not appearing:**
- Ensure you're on a problem page (not homepage or standings)
- Check that URL matches the supported formats
- Refresh the page
- Verify Tampermonkey is enabled

**Wrong solutions showing:**
- Click the button again to ensure correct URL
- Verify problem ID and letter in the URL
- Clear browser cache

## Privacy

- ✅ Runs entirely in your browser
- ✅ No data collection
- ✅ No external requests (except Codeforces)
- ✅ Open source

## Future Enhancements

Potential features:
- Filter by language
- Show solution statistics
- Highlight specific algorithms
- Integration with submission page

## Author

Pravesh Pandey
- LinkedIn: [pravesh25](https://www.linkedin.com/in/pravesh25/)

---

**Part of the [TamperScripts Collection](../)**
