import styles from "./Fact.module.css";

interface FactProps {
  title: string;
  value: string;
}

export const Fact = ({ title, value }: FactProps) => {
  return (
    <div className={styles.fact}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};
