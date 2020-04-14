# PHLIP Frontend
This repository holds the code for the UI the PHLIP project. There are other repositories that make up this project, they can be found here:
- Projects Backend API - [phlip-backend](https://github.com/CDCgov/phlip-backend)
- Document Management API - [phlip-doc-management](https://github.com/CDCgov/phlip-doc-management)

## Getting started
These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites
Below are a list of items that are required and optional for the development environment. Each item is linked to a page about installing it. 

* [Node.js](https://nodejs.org/en/download/current/ "Installing Node") - v12.14.1
  (or, via [package manager](https://nodejs.org/en/download/package-manager/ "Installing Node via Package Manager"))
* NPM - (latest that installs when Node.js is installed)

### Getting the code
```bash
$ git clone https://github.com/CDCgov/phlip.git
$ cd phlip
```

### Installing modules
Before we can run the application, we have to install node_module dependencies. Use the command below to install node_module dependencies.
```bash
$ npm install
```

### Creating .env file
The application relies on evironment variables like API urls. Use the command below to copy .env.template to .env to use the default values.
```bash
$ cp .env.template .env
```

### Running the application
Use the command below to run the application in development mode. The application will start on http://localhost:5200. You can use the default user tester1@test.gov to log in.
```bash
$ npm run start
```

## Running tests
For testing we use [Jest] and [Enzyme]. Jest as the test runner, assertion library, and mock library. Enzyme for making it 
easier to write React tests. 

#### Run once
Run tests once on the code.

```bash
$ npm run test
```

#### Watch for changes
If you want Jest to watch the files and re-run the tests when there are changes, use the command below. 

```bash
$ npm run test:watch
```

## Built With
* React.js
* Node.js
* Webpack

[Jest]: https://facebook.github.io/jest/ "Jest"
[Enzyme]: http://airbnb.io/enzyme/ "Enzyme"


## Public Domain Standard Notice

This repository constitutes a work of the United States Government and is not subject to domestic copyright protection under 17 USC § 105. This repository is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication.](https://creativecommons.org/publicdomain/zero/1.0/) All contributions to this repository will be released under the CC0 dedication. By submitting a pull request you are agreeing to comply with this waiver of copyright interest.

## License Standard Notice

This project constitutes a work of the United States Government and is not subject to domestic copyright protection under 17 USC § 105.

The project utilizes code licensed under the terms of the Apache Software License and therefore is licensed under ASL v2 or later.

This program is free software: you can redistribute it and/or modify it under the terms of the Apache Software License version 2, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Apache Software License for more details.

You should have received a copy of the Apache Software License along with this program. If not, see <http://www.apache.org/licenses/LICENSE-2.0.html>.

## Privacy Standard Notice

This project contains only non-sensitive, publicly available data and information. All material and community participation is covered by the PHIResearchLab.org [Disclaimer](http://www.phiresearchlab.org/index.php?option=com_content&view=article&id=26&Itemid=15) and [Code of Conduct](http://www.phiresearchlab.org/index.php?option=com_content&view=article&id=27&Itemid=19). For more information about CDC's privacy policy, please visit <http://www.cdc.gov/privacy.html>.

## Contributing Standard Notice

Anyone is encouraged to contribute to the repository by [forking](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and submitting a pull request. (If you are new to GitHub, you might start with a [basic tutorial](https://help.github.com/en/github/getting-started-with-github/set-up-git).) By contributing to this project, you grant a world-wide, royalty-free, perpetual, irrevocable, non-exclusive, transferable license to all users under the terms of the [Apache Software License v2](http://www.apache.org/licenses/LICENSE-2.0.html) or later.

All comments, messages, pull requests, and other submissions received through CDC including this GitHub page may be subject to applicable federal law, including but not limited to the Federal Records Act and may be archived. Learn more at <http://www.cdc.gov/other/privacy.html>.

## Records Management Standard Notice

This repository is not a source of government records, but is a copy to increase collaboration and collaborative potential. All government records will be published through the [CDC web site.](http://www.cdc.gov)

## Additional Standard Notices

Please refer to [CDC's Template Repository](https://github.com/CDCgov/template/blob/master/open_practices.md) for more information about [contributing to this repository, public domain notices and disclaimers](https://github.com/CDCgov/template/blob/master/open_practices.md), and [code of conduct.](https://github.com/CDCgov/template/blob/master/code-of-conduct.md)

## Learn more about CDC GitHub Practices for Open Source Projects

<https://github.com/CDCgov/template/blob/master/open_practices.md>

**General disclaimer** This repository was created for use by CDC programs to collaborate on public health related projects in support of the [CDC mission](https://github.com/CDCgov/template/blob/master/open_practices.md). Github is not hosted by the CDC, but is a third party website used by CDC and its partners to share information and collaborate on software. CDC’s use of GitHub does not imply an endorsement of any one particular service, product, or enterprise.