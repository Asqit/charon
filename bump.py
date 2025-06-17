#!/usr/bin/env python3
import subprocess
import datetime
import sys


def read_version() -> str:
    with open("VERSION", "r") as file:
        return file.readline() # X.Y.Z

def write_version(version: str) -> None:
    with open("VERSION", "w") as file:
        file.write(version)


def add_changelog_record(version: str) -> None:
    today = datetime.date.today()
    formatted = today.strftime("%d.%m.%Y")
    with open("CHANGELOG.md", "r", encoding="utf-8") as file:
        prev = file.read()
        prev = f"\n## {version} - {formatted}\n### Added\n-" + prev

    with open("CHANGELOG.md", "w", encoding="utf-8") as file:
        file.write(prev)


def bump(current: str, part: str) -> str:
    major, minor, patch = map(int, current.split("."))
    if part == "major":
        major += 1
        minor = 0
        patch = 0
    elif part == "minor":
        minor += 1
        patch = 0
    elif part == "patch":
        patch += 1
    else:
        raise ValueError("use: major / minor /patch")
    return f"{major}.{minor}.{patch}"


def git_tag(version) -> None:
    subprocess.run(["git", "add", "VERSION", "CHANGELOG.md"])
    subprocess.run(["git", "commit", "-m", f"Release v{version}"])
    subprocess.run(["git", "tag", f"v{version}"])
    subprocess.run(["git", "push", "--follow-tags"])


def main() -> None:
    if len(sys.argv) != 2:
        print("❌ Usage: python bump.py [major|minor|patch]")
        sys.exit(1)

    part = sys.argv[1]
    current_version = read_version();
    new_version = bump(current_version, part)
    write_version(new_version)
    add_changelog_record(new_version)
    git_tag(new_version)


    print(f"✔️ Bumped to v{new_version}")


if __name__ == "__main__":
    main()
