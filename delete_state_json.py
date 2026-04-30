from pathlib import Path


STATE_FILES = (
    Path("free.json"),
    Path("free-steam.json"),
)


def delete_state_files():
    deleted = []
    missing = []

    for state_file in STATE_FILES:
        if state_file.exists():
            state_file.unlink()
            deleted.append(str(state_file))
        else:
            missing.append(str(state_file))

    if deleted:
        print("Deleted state JSON file(s): " + ", ".join(deleted))

    if missing:
        print("State JSON file(s) already missing: " + ", ".join(missing))


if __name__ == "__main__":
    delete_state_files()
