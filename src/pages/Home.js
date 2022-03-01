import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Navigation from "../components/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import fetchJsonp from "fetch-jsonp";
import Col from "react-bootstrap/esm/Col";
import { ReactComponent as Heart } from "../assets/heart-svgrepo-com.svg";
import { ReactComponent as HeartFull } from "../assets/heart-svgrepo-com-2.svg";

const Home = () => {
  const [valueOption, setValueOption] = useState({ artiste: "", option: "" });
  const [favori, setFavori] = useState(false);
  const selectOption = useRef();
  const artisteInput = useRef();
  useEffect(() => {
    console.log(selectOption);
    console.log(selectOption.current.value);
  }, [selectOption]);

  const handleOptionChange = () => {
    setValueOption({
      option: selectOption.current.value,
      artiste: artisteInput.current.value,
    });
  };

  const changeFavoriIcon = () => {
    setFavori(!favori);
  };

  // const onSubmit = (event) => {
  //   event.preventDefault();
  //   fetch(
  //     `https://cors-anywhere.herokuapp.com/http://api.deezer.com/search/track/autocomplete?limit=1&q=eminem`,
  //     {
  //       mode: "no-cors",
  //       headers: {
  //         "Access-Control-Allow-Headers":
  //           "X-Requested-With, Content-Type, Authorization, Origin, Accept, Accept-Encoding",
  //         "Access-Control-Allow-Origin": "http://localhost:3000/",
  //         "Access-Control-Allow-Methods": "GET, POST",
  //       },
  //     }
  //   )
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   fetchJsonp(`https://api.deezer.com/search?q=eminem`, {
  //     mode: "no-cors",
  //     headers: {
  //       "Access-Control-Allow-Headers":
  //         "X-Requested-With, Content-Type, Authorization, Origin, Accept, Accept-Encoding",
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Methods": "GET, POST",
  //       "content-type": "application/javascript;charset=utf-8",
  //     },
  //   })
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  console.log(valueOption);

  return (
    <>
      <Navigation />
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Form
            // onSubmit={onSubmit}
            className="w-75 d-flex flex-column justify-content-center align-items-center"
          >
            <Form.Group className="mb-3 ">
              <Form.Label>Rechercher sur Deezer</Form.Label>
              <Form.Control
                ref={artisteInput}
                onBlur={handleOptionChange}
                type="input"
                placeholder="Damso"
                required
              />
            </Form.Group>
            <Form.Select onChange={handleOptionChange} ref={selectOption}>
              <option>Trier les résultats de la recherche par ...</option>
              <option value="ALbum">Album</option>
              <option value="Artiste">Artiste</option>
              <option value="Musique">Musique</option>
              <option value="Les plus populaires">Les plus populaires</option>
              <option value="Les moins populaires">Les moins populaires</option>
            </Form.Select>
            <Button className="m-3" type="submit">
              Rechercher
            </Button>
          </Form>
        </Row>
      </Container>
      <Container style={{ paddingBottom: "5rem" }}>
        <Row>
          <Col className="d-flex justify-content-center mb-5" sm={12} lg={4}>
            <Card style={{ width: "20rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Titre music</Card.Title>
                <Card.Text>Artiste</Card.Text>
                <Card.Text>Durée du son</Card.Text>
                {favori === true ? (
                  <HeartFull
                    onClick={changeFavoriIcon}
                    style={{ height: "25px", cursor: "pointer" }}
                  />
                ) : (
                  <Heart
                    onClick={changeFavoriIcon}
                    style={{ height: "25px", cursor: "pointer" }}
                  />
                )}

                <Stack className="mt-3" gap="2">
                  <Button size="sm" variant="primary">
                    Ecouter
                  </Button>
                  <Button size="sm" variant="primary">
                    Consulter
                  </Button>
                  <Button size="sm" variant="primary">
                    Voir affiche titre
                  </Button>
                </Stack>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
