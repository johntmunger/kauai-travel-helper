# More About Adding Activities to the Database

Want to add more Kauai activities?

1. Edit `backend/database/seed.sql`
2. Follow the existing format:

```sql
INSERT INTO activities (name, address, region, category, short_description, thumbnail_url, latitude, longitude) VALUES
('Activity Name', 'Full Address', 'Region', 'Category', 'Description', 'Image URL', lat, long);
```

3. Ensure proper region: `North`, `East`, `South`, or `West`
4. Use appropriate category: `Restaurant`, `Outdoor`, or `Nightlife`
5. Test locally before submitting

### Pull Requests

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly** - Ensure both frontend and backend work
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## 📋 Development Process

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/kauai-trip-2025.git
cd kauai-trip-2025

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Tests

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

### Code Style

- **JavaScript/Vue**: Follow existing code style
- **Use ESLint** for code quality
- **Use Prettier** for code formatting (if configured)
- **Write clear, descriptive variable names**
- **Add comments for complex logic**

## 🎨 Design Guidelines

### UI/UX

- Maintain consistent color scheme (region colors)
- Ensure mobile responsiveness
- Follow existing component patterns
- Keep accessibility in mind

### Database

- Follow existing schema structure
- Add indexes for performance
- Document any schema changes

### API

- Follow RESTful principles
- Return consistent response formats
- Handle errors gracefully
- Document new endpoints

## 📝 Commit Message Guidelines

Use clear and meaningful commit messages:

```
feat: Add new activity search feature
fix: Resolve loading state bug on activity detail page
docs: Update API setup instructions
style: Format ActivityCard component
refactor: Simplify database query logic
test: Add tests for regions endpoint
chore: Update dependencies
```

## 🧪 Testing Checklist

Before submitting a PR, verify:

- [ ] Backend server starts without errors
- [ ] Frontend builds without errors
- [ ] All regions display correctly
- [ ] Activity filtering works
- [ ] Activity detail pages load
- [ ] Mobile responsive design intact
- [ ] No console errors
- [ ] Database seeds properly
- [ ] API endpoints return expected data

## 📚 Documentation

When adding new features:

- Update README.md if setup changes
- Update API documentation for new endpoints
- Add JSDoc comments to functions
- Update CHANGELOG.md

## 🌟 Good First Issues

Looking for a place to start? Look for issues labeled:

- `good first issue`
- `help wanted`
- `documentation`

## 💡 Feature Ideas

Some areas where contributions are welcome:

### Data

- Add more activities (aim for 10+ per region)
- Add more activity categories
- Include operating hours data
- Add price range information

### Features

- Interactive map integration
- Weather widget
- User authentication
- Favorite activities
- Activity booking links
- Photo galleries
- User reviews

### Improvements

- Add unit tests
- Add E2E tests
- Improve error handling
- Add loading animations
- Optimize images
- Add PWA support
- Improve SEO

### Documentation

- Add video tutorials
- Create API documentation
- Add architecture diagrams
- Translate to other languages

## 🚫 What We're NOT Looking For

- Activities outside of Kauai
- Complete redesigns without discussion
- Breaking changes without migration path
- Unrelated feature additions
- Code without tests (for critical features)

## 📞 Getting Help

- **Questions?** Open a GitHub Discussion
- **Found a bug?** Open an issue
- **Want to chat?** Open a discussion thread

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- Be respectful and inclusive
- Be patient and welcoming
- Be considerate of others
- Be collaborative
- Gracefully accept constructive criticism

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

## 🌺 Mahalo!

Thank you for contributing to making Kauai Travel Helper better for everyone! Your efforts help travelers discover the beauty of Kauai.

---

Questions? Feel free to ask in GitHub Discussions or open an issue!
