import { useState, useEffect, useCallback } from "react";
import toastError from "../../errors/toastError";
import api from "../../services/api";

const useTickets = ({
  isSearch,
  searchParam,
  tags,
  users,
  pageNumber,
  status,
  groups,
  date,
  updatedAt,
  showAll,
  queueIds,
  withUnreadMessages,
  all,
  isNotificationBalloonOfSuporte,
  saler
}) => {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [tickets, setTickets] = useState([]);

  const fetchTickets = useCallback(async () => {
    try {

      const salerId = Array.isArray(saler) && saler.length > 0 ? saler[0].id : null;
      const { data } = await api.get("/tickets", {
        params: {
          isSearch,
          searchParam,
          pageNumber,
          tags,
          users,
          status,
          groups,
          date,
          updatedAt,
          showAll,
          queueIds,
          withUnreadMessages,
          all,
          salerId
        },
      });

      if (isNotificationBalloonOfSuporte) {
        const ticketsReversed = data.tickets.reverse();
        setTickets((prevTickets) => [...ticketsReversed, ...prevTickets]);
      } else {
        setTickets(data.tickets);
      }

      setHasMore(data.hasMore);
    } catch (err) {
      toastError(err);
      console.log("Erro ao buscar tickets", err);
    } finally {
      setLoading(false);
    }
  }, [
    isSearch,
    searchParam,
    pageNumber,
    tags,
    users,
    status,
    groups,
    date,
    updatedAt,
    showAll,
    queueIds,
    withUnreadMessages,
    all,
    saler,
    isNotificationBalloonOfSuporte
  ]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchTickets();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    hasMore,
    refreshTickets: fetchTickets
  };
};

export default useTickets;
