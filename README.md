# ABAP ADT MCP Server

**Note:** This repository is an AI-assisted creation, combining and enhancing features from the original implementations.

---

## 🌟 Overview

Transform your ABAP development workflow with this Model Context Protocol (MCP) server. Designed to bridge the gap between modern development tools and SAP ABAP systems, this server provides comprehensive access to ABAP Development Tools (ADT) REST APIs.

### ✨ Key Capabilities

- � **Source Code Access** - Retrieve classes, programs, functions, and includes
- 📊 **Data Dictionary Integration** - Explore tables, structures, and type definitions
- 🔎 **Smart Search & Analysis** - Find objects and analyze dependencies
- 📈 **Runtime Insights** - Access traces and runtime dump analysis
- 🎯 **Developer-Friendly** - Seamless integration with modern IDEs

---

## 🏗️ Architecture Overview

This server implements a modular handler architecture where each ABAP operation is managed by dedicated handlers located in `src/handlers/`. The central registry (`src/toolDefinitions.ts`) orchestrates tool mappings, schemas, and descriptions.

### 📂 Handler Categories

#### 🧩 **Core ABAP Objects**

| Handler            | Purpose                   | Key Features                       |
| ------------------ | ------------------------- | ---------------------------------- |
| `GetClass`         | ABAP class retrieval      | Complete source code with metadata |
| `GetProgram`       | Report program access     | Full program source and structure  |
| `GetFunction`      | Function module details   | Interface and implementation code  |
| `GetFunctionGroup` | Function group management | Group structure and includes       |
| `GetInclude`       | Include program access    | Shared code components             |
| `GetInterface`     | Interface definitions     | Contract specifications            |

#### 📚 **Data Dictionary (DDIC)**

| Handler                | Purpose                  | Key Features                   |
| ---------------------- | ------------------------ | ------------------------------ |
| `GetTable`             | Table structure analysis | Field definitions and metadata |
| `GetTableContents`     | Data exploration         | Configurable row limits        |
| `GetStructure`         | Structure definitions    | Type hierarchies               |
| `GetDDIC_CDS`          | CDS view access          | Modern view definitions        |
| `GetDDIC_DataElements` | Element metadata         | Base type information          |
| `GetDDIC_Domains`      | Domain specifications    | Value constraints              |

#### 🔍 **Search & Analysis**

| Handler        | Purpose                | Key Features               |
| -------------- | ---------------------- | -------------------------- |
| `SearchObject` | Quick object discovery | Pattern-based searching    |
| `GetWhereUsed` | Dependency analysis    | Usage relationship mapping |
| `API_Releases` | Release information    | Version compatibility data |

#### 🏢 **System Integration**

| Handler           | Purpose             | Key Features             |
| ----------------- | ------------------- | ------------------------ |
| `GetPackage`      | Package management  | Organizational structure |
| `GetTransaction`  | Transaction details | T-code information       |
| `GetMessageClass` | Message handling    | Error and info messages  |

#### 📊 **Runtime Analysis**

| Handler           | Purpose                | Key Features               |
| ----------------- | ---------------------- | -------------------------- |
| `DataPreview`     | Live data inspection   | Real-time table/view data  |
| `GetRuntimeDumps` | Error analysis         | System failure diagnostics |
| `GetABAPTraces`   | Performance monitoring | Execution trace analysis   |

---

## 🚀 Quick Start Guide

### Prerequisites Checklist ✅

Before diving in, ensure you have:

- **SAP ABAP System Access**

  - System URL (e.g., `https://sap-system.company.com:8000`)
  - Valid credentials (username/password)
  - Client number (e.g., `100`)
  - ADT services activated in `SICF` transaction

- **Development Environment**
  - [Node.js LTS](https://nodejs.org/) (includes npm)
  - [Git](https://git-scm.com/) or [GitHub Desktop](https://desktop.github.com/)
  - Text editor or IDE (VS Code recommended)

### 🛠️ Installation Methods

**Step 1: Repository Setup**

Choose your preferred method to get the source code:

```bash
# Via Git command line
git clone https://github.com/buettnerjulian/abap-adt-mcp.git
cd abap-adt-mcp

# Or download and extract ZIP from GitHub
```

**Step 2: Dependency Installation**

```bash
# Install all required packages
npm install

# Build the TypeScript project
npm run build
```

**Step 3: Environment Configuration**

Create a `.env` file in the project root with your SAP system details:

```env
# SAP System Configuration
SAP_URL=https://your-sap-system.com:8000
SAP_USERNAME=your_username
SAP_PASSWORD="your_password"  # Use quotes if password contains special characters
SAP_CLIENT=100

# Optional: Skip TLS verification for development
# NODE_TLS_REJECT_UNAUTHORIZED=0
```

> 🔐 **Security Note:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

---

## 🏃‍♂️ Running the Server

### Development Mode (Recommended for Testing)

Launch the server with the MCP Inspector for interactive testing:

```bash
npm run dev
```

This opens a browser interface at `http://localhost:5173` where you can:

- Test individual tools
- Inspect requests/responses
- Debug connection issues

### Production Mode

For integration with MCP clients:

```bash
npm run start
```

The server runs in headless mode, ready for client connections.

---

## �️ Troubleshooting Guide

### Common Issues & Solutions

#### ❌ Node.js Installation Problems

```bash
# Verify installation
node -v  # Should show version number
npm -v   # Should show version number

# If missing, download from https://nodejs.org
```

#### ❌ Build Failures

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### ❌ SAP Connection Issues

1. **Check ADT Services**

   - Verify `/sap/bc/adt` is active in `SICF`
   - Test URL in browser: `https://your-sap-system.com:8000/sap/bc/adt/discovery`

2. **Authentication Problems**

   - Verify credentials in `.env`
   - Test with SAP GUI login
   - Check client number

3. **SSL/Certificate Issues**
   ```bash
   # For development only - disable TLS verification
   export NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

#### ❌ General Integration Problems

1. **Permission Issues**

   - Ensure file permissions allow execution
   - Check antivirus software blocking

2. **Manual Testing**
   ```bash
   # Test server directly
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

---

## 🙏 Acknowledgments

This project builds upon the work from:

- [workskong/mcp-abap-adt](https://github.com/workskong/mcp-abap-adt) - Original concept and implementation
- [mario-andreschak/mcp-abap-adt](https://github.com/mario-andreschak/mcp-abap-adt) - Enhanced features and stability

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

_Happy ABAP Development! 🎯_
