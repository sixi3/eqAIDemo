# EQ AI Voice Assistant Prototype

An interactive React prototype for an AI voice assistant focused on beautiful animations and smooth demo experiences.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically open in your default browser

## 📁 Project Structure

```
eqAIDemo-1/
├── .cursor/                 # Cursor IDE configuration
│   └── rules/              # Development guidelines
├── docs/                   # Project documentation
├── src/
│   ├── components/         # React components
│   │   ├── onboarding/    # Onboarding flow components
│   │   ├── chat/          # Chat interface components
│   │   ├── voice/         # Voice interaction components
│   │   └── animations/    # Animation primitives
│   ├── flows/             # Complete demo flows
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions and demo data
├── public/                # Static assets
└── tasks/                 # Development tasks and planning
```

## 🎯 Features

- **Voice Interaction**: Real-time speech recognition and synthesis
- **Smooth Animations**: 60fps animations using Framer Motion
- **Demo Flows**: Pre-scripted conversation demonstrations
- **Responsive Design**: Works on desktop and tablet devices
- **TypeScript**: Full type safety and IntelliSense support

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Demo Scripts

- `npm run demo:onboarding` - Open onboarding demo
- `npm run demo:chat` - Open chat demo

## 🎨 Design System

### Colors
- **Voice States**: Defined in `tailwind.config.js`
  - Idle: Gray
  - Listening: Blue
  - Processing: Amber
  - Speaking: Green
  - Error: Red

### Animations
- **Entrance**: Fade in with slight scale
- **Voice Active**: Pulsing glow effect
- **Transitions**: Smooth slide and fade effects

## 📚 Documentation

- [Architecture](docs/architecture.md) - System overview and component structure
- [Demo Flows](docs/demo-flows.md) - Detailed demo specifications
- [Technical Guide](docs/technical.md) - Implementation details
- [Development Tasks](tasks/tasks.md) - Current development roadmap

## 🔧 Configuration

The project uses Cursor IDE with custom rules for:
- React best practices
- Animation guidelines
- Voice interaction patterns
- Demo flow management

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform

## 📝 License

This project is for demonstration purposes.

## 🤝 Contributing

This is a prototype project. For development guidelines, see the `.cursor/rules/` directory.