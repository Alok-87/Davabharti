interface CarouselCardProps<T> {
  data: T;
  render: (item: T) => React.ReactNode;
}

export default function CarouselCard<T>({ data, render }: CarouselCardProps<T>) {
  return <>{render(data)}</>;
}
