# -*- mode: python -*-
a = Analysis(['lyletube.py'],
             pathex=['.'],
             hiddenimports=[],
             hookspath=None)
import glob
for i in glob.glob('static/*'): a.datas += [(i, i, 'DATA')]
pyz = PYZ(a.pure)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          name=os.path.join('dist', 'lyletube.exe'),
          debug=False,
          strip=None,
          upx=True,
          console=True )
