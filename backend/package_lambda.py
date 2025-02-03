import shutil
import subprocess
from pathlib import Path

def package_lambda():
    """Package the FastAPI app and its dependencies into a ZIP file for deployment to AWS Lambda."""
    current_dir = Path(__file__).parent.resolve()
    app_dir = current_dir / "app"
    main_file = current_dir / "main.py"
    requirements_file = current_dir / "requirements.txt"
    package_dir = current_dir / "lambda_package"
    output_zip = current_dir / "lambda_function.zip"
    
    if not main_file.exists():
        raise FileNotFoundError("main.py not found in the current directory.")
    if not app_dir.exists() or not app_dir.is_dir():
        raise FileNotFoundError("app/ directory not found in the current directory.")
    if not requirements_file.exists():
        raise FileNotFoundError("requirements.txt not found in the current directory.")
    
    if package_dir.exists():
        shutil.rmtree(package_dir)
    package_dir.mkdir()

    shutil.copy(main_file, package_dir)
    shutil.copytree(app_dir, package_dir / "app", dirs_exist_ok=True)
    
    subprocess.run(
        [
            "pip",
            "install",
            "-r",
            str(requirements_file),
            "--target",
            str(package_dir)
        ],
        check=True
    )

    subprocess.run(
        [
            "pip",
            "install",
            "pydantic==2.10.6",
            "pydantic-core==2.27.2",
            "--platform",
            "manylinux2014_x86_64",
            "--python-version",
            "3.13",
            "-t",
            str(package_dir),
            "--only-binary=:all:",
            "--upgrade"
        ],
        check=True
    )

    
    if output_zip.exists():
        output_zip.unlink()
    shutil.make_archive(output_zip.stem, 'zip', package_dir)

    shutil.rmtree(package_dir)
    
    print(f"Lambda package created: {output_zip}")

if __name__ == "__main__":
    package_lambda()