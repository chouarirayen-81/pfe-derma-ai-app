import os
import zipfile

src_dir = r"ia-service\models\efficientnet_b3_dermato_23classes_enriched_mobile.pt\efficientnet_b3_dermato_23classes_enriched_mobile"
dst_file = r"ia-service\models\efficientnet_b3_dermato_23classes_enriched_mobile_fixed.pt"

count = 0

with zipfile.ZipFile(dst_file, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, _, files in os.walk(src_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, src_dir)
            zf.write(full_path, rel_path)
            count += 1
            print("Ajout :", rel_path)

print(f"\n✅ Fichier reconstruit : {dst_file}")
print(f"✅ Nombre de fichiers ajoutés : {count}")