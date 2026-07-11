from PIL import Image

def main():
    # Load original logo
    img_path = 'public/readme/udhaarclear.png'
    im = Image.open(img_path)
    
    # Save as -dark version
    im.save('public/readme/udhaarclear-dark.png')
    print("Saved public/readme/udhaarclear-dark.png")
    
    # Invert the RGB channels while keeping alpha intact
    if im.mode == 'RGBA':
        r, g, b, a = im.split()
        r = r.point(lambda i: 255 - i)
        g = g.point(lambda i: 255 - i)
        b = b.point(lambda i: 255 - i)
        im_inverted = Image.merge('RGBA', (r, g, b, a))
    else:
        # Fallback for RGB or other modes
        from PIL import ImageOps
        im_inverted = ImageOps.invert(im.convert('RGB'))
        
    # Save as -white version
    im_inverted.save('public/readme/udhaarclear-white.png')
    print("Saved public/readme/udhaarclear-white.png")

if __name__ == '__main__':
    main()
