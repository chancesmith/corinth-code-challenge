import Home from "@/pages/index";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter, Router } from "next/router";
import people from "../lib/db-lib";
import "whatwg-fetch";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Home", () => {
  it("should see default luke results", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { search: undefined },
      replace: jest.fn(),
    });

    jest.spyOn(people, "getPeople").mockResolvedValueOnce({
      count: 1,
      results: [
        {
          name: "Luke Skywalker",
          height: "172",
          mass: "77",
          hair_color: "blond",
          birth_year: "19BBY",
          skin_color: "fair",
          eye_color: "blue",
          films: ["https://swapi.dev/api/films/1/"],
          species: ["https://swapi.dev/api/species/1/"],
          vehicles: ["https://swapi.dev/api/vehicles/14/"],
          starships: ["https://swapi.dev/api/starships/12/"],
          created: "2014-12-09T13:50:51.644000Z",
          edited: "2014-12-20T21:17:56.891000Z",
          url: "https://swapi.dev/api/people/1/",
          gender: "male",
          homeworld: "https://swapi.dev/api/planets/1/",
        },
      ],
    });
    render(<Home />);
    const input = screen.getByPlaceholderText("luke skywalker");
    expect(input).toBeInTheDocument();

    expect(screen.getByText("Loading")).toBeInTheDocument();

    waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    });
  });

  it("should see R2-D2 results after typing", async () => {
    render(<Home />);
    const input = screen.getByPlaceholderText("luke skywalker");

    jest.spyOn(people, "getPeople").mockResolvedValueOnce({
      count: 1,
      results: [
        {
          name: "R2-D2",
          height: "96",
          mass: "32",
          hair_color: "n/a",
          skin_color: "white, blue",
          eye_color: "red",
          birth_year: "33BBY",
          gender: "n/a",
          homeworld: "https://swapi.dev/api/planets/8/",
          films: [
            "https://swapi.dev/api/films/1/",
            "https://swapi.dev/api/films/2/",
            "https://swapi.dev/api/films/3/",
            "https://swapi.dev/api/films/4/",
            "https://swapi.dev/api/films/5/",
            "https://swapi.dev/api/films/6/",
          ],
          species: ["https://swapi.dev/api/species/2/"],
          vehicles: [],
          starships: [],
          created: "2014-12-10T15:11:50.376000Z",
          edited: "2014-12-20T21:17:50.311000Z",
          url: "https://swapi.dev/api/people/3/",
        },
      ],
    });

    // ACT
    fireEvent.change(input, { target: { value: "r2-d2" } });

    // ASSERT
    expect(screen.getByText("Loading")).toBeInTheDocument();

    waitFor(() => {
      expect(screen.getByText("R2-D2")).toBeInTheDocument();
    });
  });
});
