import { Command } from "commander";
import prompts from "prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { TEMPLATES } from "./templates/components";

const program = new Command();

program
  .name("shadowui")
  .description("CLI to add and customize ShadowUI components directly in your project")
  .version("0.0.1");

// 1. COMMAND: shadowui list
program
  .command("list")
  .description("List all available ShadowUI components")
  .action(() => {
    console.log(pc.bold(pc.cyan("\nAvailable ShadowUI Components:\n")));
    Object.values(TEMPLATES).forEach((tmpl) => {
      console.log(`  ${pc.green("✔")} ${pc.bold(tmpl.name.padEnd(12))} - ${pc.dim(tmpl.description)}`);
    });
    console.log("\nUse " + pc.cyan("npx shadowui add <component>") + " to install.\n");
  });

// 2. COMMAND: shadowui init
program
  .command("init")
  .description("Initialize ShadowUI in your project")
  .action(async () => {
    console.log(pc.bold(pc.magenta("\n✨ Initializing ShadowUI...\n")));

    const response = await prompts([
      {
        type: "text",
        name: "componentDir",
        message: "Where should components be installed?",
        initial: "components/ui",
      },
      {
        type: "select",
        name: "theme",
        message: "Which default skin do you want to use?",
        choices: [
          { title: "Fluid Glass (Optical Refraction & Caustics)", value: "fluid-glass" },
          { title: "Primer (Clean Minimalist Solid)", value: "primer" },
          { title: "Both / All Themes", value: "all" },
        ],
        initial: 0,
      },
    ]);

    if (!response.componentDir) {
      console.log(pc.yellow("Initialization cancelled."));
      return;
    }

    const targetDir = path.resolve(process.cwd(), response.componentDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write shadowui.json config
    const configPath = path.resolve(process.cwd(), "shadowui.json");
    const config = {
      $schema: "https://shadowui.dev/schema.json",
      componentDir: response.componentDir,
      defaultSkin: response.theme,
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

    console.log(pc.green(`✔ Created ${pc.bold(response.componentDir)} directory`));
    console.log(pc.green(`✔ Created ${pc.bold("shadowui.json")} configuration`));
    console.log(pc.cyan("\nNext Steps:"));
    console.log(`  1. Ensure ${pc.bold("@shadoworg/shadowui")} is installed in dependencies:`);
    console.log(`     ${pc.dim("npm install @shadoworg/shadowui")}`);
    console.log(`  2. Add components with:`);
    console.log(`     ${pc.dim("npx shadowui add card")}\n`);
  });

// 3. COMMAND: shadowui add <components...>
program
  .command("add [components...]")
  .description("Add one or more components to your project")
  .option("-o, --overwrite", "Overwrite existing component files without asking", false)
  .option("-p, --path <path>", "Custom destination directory (overrides shadowui.json)")
  .action(async (components: string[], options: { overwrite?: boolean; path?: string }) => {
    let selectedComponents = components;

    if (!selectedComponents || selectedComponents.length === 0) {
      const promptRes = await prompts({
        type: "multiselect",
        name: "components",
        message: "Select components to add to your project:",
        choices: Object.values(TEMPLATES).map((tmpl) => ({
          title: `${tmpl.name} - ${tmpl.description}`,
          value: tmpl.name,
        })),
        min: 1,
      });

      if (!promptRes.components || promptRes.components.length === 0) {
        console.log(pc.yellow("No components selected. Aborting."));
        return;
      }
      selectedComponents = promptRes.components;
    }

    // Determine target directory
    let targetDirName = options.path;
    if (!targetDirName) {
      const configPath = path.resolve(process.cwd(), "shadowui.json");
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          targetDirName = config.componentDir;
        } catch {
          // ignore
        }
      }
    }
    if (!targetDirName) {
      targetDirName = "components/ui";
    }

    const targetDir = path.resolve(process.cwd(), targetDirName);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log(pc.bold(pc.cyan(`\nInstalling components into ${pc.white(targetDirName)}:\n`)));

    for (const name of selectedComponents) {
      const tmpl = TEMPLATES[name.toLowerCase()];
      if (!tmpl) {
        console.log(pc.red(`✖ Component "${name}" not found in registry.`));
        continue;
      }

      const destFile = path.join(targetDir, tmpl.filename);

      if (fs.existsSync(destFile) && !options.overwrite) {
        const confirm = await prompts({
          type: "confirm",
          name: "overwrite",
          message: `File ${tmpl.filename} already exists. Overwrite?`,
          initial: false,
        });

        if (!confirm.overwrite) {
          console.log(pc.yellow(`  ↷ Skipped ${tmpl.filename}`));
          continue;
        }
      }

      fs.writeFileSync(destFile, tmpl.code, "utf-8");
      console.log(`  ${pc.green("✔")} Created ${pc.bold(path.join(targetDirName, tmpl.filename))}`);
    }

    console.log(pc.bold(pc.green("\n✨ Component(s) ready! You have full control to edit the JSX and styles.")));
    console.log(pc.dim("Ensure @shadoworg/shadowui is installed for the fluid-glass physics engine.\n"));
  });

program.parse(process.argv);
