import { Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";

function WelcomePage() {
    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Typography variant="h3" sx={{ marginBottom: 4 }}>
                Bienvenue sur notre Jeu !
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/game"
            >
                Jouer
            </Button>
        </Container>
    );
}

export default WelcomePage;

