import { PeopleData, Person } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL;

/*
 * GET PEOPLE
 */
export const peopleEndpoint = `${API}/people`;

interface GetPeopleProps {
  search?: string | string[];
}

const getPeople = async ({ search }: GetPeopleProps) => {
  const url = !!search ? `${peopleEndpoint}?search=${search}` : peopleEndpoint;
  const res = await fetch(url);

  return (await res.json()) as PeopleData;
};

/*
 * GET PERSON
 */
export const personEndpoint = `${API}/people`;

interface GetPersonProps {
  id: string;
}

const getPerson = async ({ id }: GetPersonProps) => {
  const res = await fetch(`${personEndpoint}/${id}`);

  return (await res.json()) as Person;
};

const people = { getPeople, getPerson };
export default people;
