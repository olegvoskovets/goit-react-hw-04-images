import { useEffect, useState } from 'react';
import css from './App.module.css';
import { Searchbar } from './Searchbar/Searchbar';
import { getGallary } from 'api/api_server';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { NoFotos } from './NoFotos/NoFotos';
import { Error } from './Error/Error';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [fotos, setFotos] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalHits, setTotalHits] = useState(false);
  const [per_page, setPer_page] = useState(12);
  const [isEmply, setIsEmply] = useState(false);
  const [foto, setFoto] = useState('');

  useEffect(() => {
    if (!search) return;
    setIsLoading(true);

    async function fetchData() {
      try {
        const data = await getGallary(search, page, per_page);
        if (!data.hits.length) {
          setIsEmply(true);
          return;
        }
        setFotos(prevState => [...prevState, ...data.hits]);
        setTotalHits(data.totalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [page, search, per_page]);

  const addPageGallery = () => {
    setPage(prevState => prevState + 1);
  };

  const handleSubmit = newSearch => {
    setSearch(newSearch);
    setPage(1);
    setIsEmply(false);
    setFotos([]);
    setTotalHits(0);
    setError('');
  };
  const handleModal = foto => {
    setFoto(foto);
  };

  const showBtn = page < Math.ceil(totalHits / per_page);

  return (
    <div className={css.App}>
      <Searchbar handleSubmit={handleSubmit} />
      <ImageGallery fotos={fotos} openModal={handleModal} />
      {isLoading && <Loader />}
      {showBtn && <Button onClick={addPageGallery} />}
      {isEmply && <NoFotos />}
      {error && <Error error={error} />}
      {foto && (
        <Modal
          onCloseModal={handleModal}
          children={<img src={foto} alt={foto} style={{ maxWidth: '900px' }} />}
        />
      )}
    </div>
  );
};
