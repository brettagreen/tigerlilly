import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

/**
 * @component /frontend/src/components/Footer
 * @requires module:mui/material/Link
 * @requires module:mui/material/Grid
 * 
 * @description Footer component. used at the bottom of all pages. holds some relevant links and looks pretty
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} - footer containing an image and some links organized with mui Grid
 *
 */
function Footer() {

return (
    <footer id="footer" style={{display: 'block', marginTop: 'auto'}}>
        <div style={{float: 'left', marginRight: '4em'}}>
            <img width={100} src="/images/TLO_footer.jpg" alt="TLO logo" />
        </div>
        <div style={{float: 'left', position: 'relative', bottom: '-7em'}}>
            <Grid container direction="row" rowSpacing={0} columnSpacing={0} columns={5} sx={{alignItems: 'flex-end'}}>
                <Grid item lg={2} xl={2} md={2}>
                    <Link href="/about" underline='always' color="#f3f2f2">About</Link>
                </Grid>

                <Grid item lg={2} xl={2} md={2}>
                    <img width={20} src="/images/tiktok_icon.png" alt="tik tok social" /> TikTok
                </Grid>

                <Grid item lg={2} xl={2} md={2}>
                    <Link href="/contact" underline='always' color="#f3f2f2">Contact Us</Link>
                </Grid>

                <Grid item lg={2} xl={2} md={2}>
                    <img width={20} src="/images/medium_icon.png" alt="medium social" /> Medium.com
                </Grid>
            </Grid>
        </div>
        <div style={{float: 'left', position: 'relative', bottom: '-10.4em'}}>
            Copyright 2024 The Tigerlilly Online
        </div>
    </footer>
    );
}

export default Footer;


