/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Navigation from "../../components/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import fetchJsonp from "fetch-jsonp";
import CardData from "./HomeCard";
import type { DeezerSdkTrack } from "../../types";
import Loader from "../../components/Loader";
import ScrollToTop from "../../components/BackToTop";

const Home = () => {
  const [valueOption, setValueOption] = useState({ artiste: "", option: "" });
  const [data, setData] = useState<DeezerSdkTrack[]>([]);
  const [dataLocalStorage, setDataLocalStorage] = useState<DeezerSdk.Track[]>([]);
  const selectOption: React.RefObject<HTMLSelectElement> = useRef(null);
  const artisteInput: React.RefObject<HTMLInputElement> = useRef(null);
  const allFavorites: DeezerSdk.Track[] = [];
  const [scrollPosition, setScrollPosition] = useState<number>();
  const [windowHeigth, setWindowHeigth] = useState<number>();
  const [nextResult, setNextResult] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [query, setQuery] = useSearchParams();
  const location = useLocation();

  const getScrollPosition: EventListener = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const documentHeigth = Math.ceil(document.documentElement.scrollHeight);
    const windowHeight = Math.ceil(window.innerHeight);
    const scroll = Math.ceil(window.scrollY);
    setWindowHeigth(scroll);
    setScrollPosition(documentHeigth - windowHeight);
  };

  useEffect(() => {
    if (!localStorage.getItem("favori")) {
      localStorage.setItem("favori", "");
    }
  }, []);

  useEffect(() => {
    if (dataLocalStorage === null) {
      return;
    } else {
      if (localStorage.getItem("favori")) {
        setDataLocalStorage(JSON.parse(localStorage.getItem("favori") || ""));
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", getScrollPosition);
    if (
      scrollPosition !== undefined &&
      nextResult !== undefined &&
      windowHeigth !== undefined &&
      windowHeigth >= scrollPosition
    ) {
      fetchJsonp(nextResult)
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          setIsLoading(true);
          setNextResult(res.next);
          setData((prevSate) => [...prevSate, ...res.data]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      window.removeEventListener("scroll", getScrollPosition);
    };
  }, [windowHeigth]);

  useEffect(() => {
    if (location.search.length > 0) {
      if (location.search.split("=").length === 2) {
        setIsLoading(true);
        const search = location.search.split("=").at(1);
        fetchJsonp(`https://api.deezer.com/search?q=${search}&output=jsonp`)
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            setNextResult(res.next);
            setData(res.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setIsLoading(true);
        const search = location.search.split("&");
        fetchJsonp(`https://api.deezer.com/search${search.at(0)}&${search.at(1)}&output=jsonp`)
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            setNextResult(res.next);
            setData(res.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, []);

  const handleOptionChange = () => {
    if (selectOption.current && artisteInput.current) {
      setValueOption({
        option: selectOption.current.value,
        artiste: artisteInput.current.value
      });
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    fetchJsonp(
      `https://api.deezer.com/search?q=${valueOption.artiste}&order=${valueOption.option}&output=jsonp`
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setNextResult(res.next);
        setData(res.data);
        setIsLoading(false);
        if (valueOption.option === "DEFAULT") {
          setQuery(`q=${valueOption.artiste}`);
        } else {
          setQuery(`q=${valueOption.artiste}&order=${valueOption.option}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Navigation />
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Form
            onSubmit={onSubmit}
            className="w-75 d-flex flex-column justify-content-center align-items-center"
          >
            <Form.Group className="mb-3 ">
              <Form.Label>Rechercher sur Deezer</Form.Label>
              <Form.Control
                ref={artisteInput}
                onBlur={handleOptionChange}
                type="input"
                placeholder="Rechercher un titre, un album ..."
                required
              />
            </Form.Group>
            <Form.Select onChange={handleOptionChange} ref={selectOption}>
              <option value="DEFAULT">Trier les résultats de la recherche par ...</option>
              <option value="ALBUM_ASC">Album</option>
              <option value="ARTIST_ASC">Artiste</option>
              <option value="TRACK_ASC">Musique</option>
              <option value="RANKING">Les plus populaires</option>
              <option value="RATING_ASC">Mieux Notées</option>
            </Form.Select>
            <Button className="m-3" type="submit">
              Rechercher
            </Button>
          </Form>
        </Row>
      </Container>
      <Container style={{ paddingBottom: "5rem" }}>
        <Row>
          {(isLoading && (
            <div className="loader-container">
              <Loader />
            </div>
          )) ||
            (data &&
              data.map((datas) => (
                <CardData
                  key={datas.id}
                  data={datas}
                  dataLocalStorage={dataLocalStorage}
                  allFavorites={allFavorites}
                  setDataLocalStorage={setDataLocalStorage}
                />
              )))}
        </Row>
        {nextResult && <ScrollToTop />}
      </Container>
    </>
  );
};

export default Home;
