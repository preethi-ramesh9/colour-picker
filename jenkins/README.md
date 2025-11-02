# Jenkins CI/CD Configuration

This directory contains Jenkins pipeline configurations for the Color Picker React application.

## Jenkinsfile

The main Jenkinsfile is located at the root of the project. It includes:

### Pipeline Stages:
1. **Checkout** - Checks out the source code from SCM
2. **Install Dependencies** - Installs npm packages using `npm ci`
3. **Lint** - Validates code (optional, runs during build)
4. **Build** - Creates production build using `npm run build`
5. **Test** - Runs test suite (if tests exist)
6. **Archive Build** - Archives build artifacts
7. **Build Summary** - Displays build information

### Prerequisites:

1. **Jenkins Setup:**
   - Jenkins server installed and running
   - Node.js plugin installed in Jenkins
   - Pipeline plugin installed

2. **Node.js Configuration:**
   - Configure NodeJS tool in Jenkins (Manage Jenkins → Global Tool Configuration)
   - Set the NodeJS version (recommended: Node.js 18 or higher)

### Setting Up Jenkins Job:

1. **Create a New Pipeline Job:**
   - Go to Jenkins Dashboard
   - Click "New Item"
   - Enter job name (e.g., "color-picker-app")
   - Select "Pipeline" and click OK

2. **Configure Pipeline:**
   - In Pipeline section, select:
     - Definition: "Pipeline script from SCM"
     - SCM: Git (or your version control system)
     - Repository URL: Your repository URL
     - Branch: */main or */master
     - Script Path: Jenkinsfile

3. **Build the Job:**
   - Click "Build Now"
   - Monitor the build progress

### Environment Variables:

You can customize the pipeline by setting these environment variables in Jenkins:

- `NODE_VERSION`: Node.js version to use (default: 18)
- `BUILD_DIR`: Build output directory (default: build)

### Alternative Configuration:

`Jenkinsfile.declarative` provides an alternative configuration using Docker agent, which can be useful for consistent builds across different environments.

### Build Artifacts:

The build artifacts (production-ready files) will be stored in the `build/` directory and archived automatically after each successful build.

### Deployment (Optional):

To add deployment stages, you can extend the pipeline with additional stages:

```groovy
stage('Deploy to Production') {
    steps {
        sh '''
            # Add your deployment commands here
            # e.g., rsync, scp, or cloud deployment commands
        '''
    }
}
```

### Notifications:

Uncomment the email notification sections in the `post` block to receive build status notifications.

### Troubleshooting:

1. **Node.js not found:**
   - Ensure Node.js plugin is installed
   - Configure NodeJS in Global Tool Configuration

2. **Build fails:**
   - Check Node.js version compatibility
   - Verify all dependencies are correctly listed in package.json

3. **Tests failing:**
   - Tests are set to not fail the build (`|| true`)
   - Modify if you want tests to block the pipeline

For more information, visit: https://www.jenkins.io/doc/book/pipeline/
