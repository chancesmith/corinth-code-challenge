interface FactProps {
  title: string;
  value: string;
}

export const Fact = ({ title, value }: FactProps) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};
