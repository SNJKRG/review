"use client";
import Header from "../../../components/Header";
import Link from "next/link";
import Footer from "../../../components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFavorites } from "@/api/favorites"; 
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { modalsConfig } from "@/components/modalConfig";
import { addCartItem, getCart } from "@/api/cart"; 
import { FavoriteItem } from "@/types/favorites";
import { useCart } from "@/context/cartContext";
import { AddCartItemPayload } from "@/types/cart";

export default function FavoritesPage() {
    const {
    toggleModal,
    isOpen,
    setSearchQuery,
    searchQuery
  } = useModal();

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);
  const {token} = useAuth();
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const { cart, setCart } = useCart();

  const router = useRouter();
  const [qrActive, setQrActive] = useState(false);

  const handleAddToCart = async (payload: AddCartItemPayload) => {
      if (!token) {
        toggleModal("login");
        return;
      }
      try {
        await addCartItem(
          {
            product_id: payload.product_id,
            store_id: payload.store_id,
            quantity: payload.quantity
          },
          token
        );
        const updatedCart = await getCart(token);
        setCart(updatedCart);
      } catch (err) {
        console.error("Ошибка при добавлении в корзину", err);
      }
    };
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) {
          throw new Error("Token is required to fetch favorites.");
        }
        const favoriteData = await getFavorites(1, token); 
        setFavorites(favoriteData.items);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFavorites();
    } else {
      router.push("/"); 
    }
  }, [token, router]);


      useEffect(() => {
        if (!token) return; 
        const fetchCart = async () => {
          try {
            const data = await getCart(token);
            setCart(data);
          } catch (err) {
            console.error("Ошибка при загрузке корзины", err);
          }
        };
        fetchCart();
      }, [token, setCart]);

      

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      if (!isOpen("search")) toggleModal("search");
    } else {
      if (isOpen("search")) toggleModal("search");
    }
  }, [searchQuery, isOpen, toggleModal]);



  return (
    <div className="absolute w-full h-full bg-white top-0 left-0">
      <Header 
        onLoginOpenAction={() => toggleModal("login")}
        onCartOpenAction={() => toggleModal("cart")}
        onPartnerOpenAction={() => toggleModal("partner")}
        onHelpOpenAction={() => toggleModal("help")}
        onCatalogOpenAction={() => toggleModal("catalog")}
        onSearchOpenAction={() => toggleModal("search")}
        searchQuery={searchQuery}
        setSearchQueryAction={setSearchQuery}
                qrActive={qrActive}
        setQrActiveAction={setQrActive}
      />

          <div>
            {modalsConfig.map(
              ({ name, zIndex, width, height, position, content }) =>
                isOpen(name) && (
                  <div
                    key={name}
                    className={`fixed inset-0 top-[132px] ${zIndex} bg-opacity-30 flex justify-end`}
                    onClick={() => toggleModal(name)}
                  >
                    <div
                      className={`relative ${width} ${height} ${position} ${
                        name !== "search" ? "ml-auto" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {name === "search"
                        ? content({ toggleModal, searchQuery, qr: qrActive })
                        : content({ toggleModal, searchQuery })}
                    </div>
                  </div>
                )
            )}
          </div>

      {/* Основной контент страницы с затемнением при открытых модальных окнах */}
      <div
        className={
          (isOpen("login") || isOpen("cart") || isOpen("help") || isOpen("partner") || isOpen("catalog") || isOpen("search"))
        ? "bg-gray-300 filter brightness-40"
        : ""
        }
      >
        <section className="w-[1200px] mx-auto mt-[135px] pt-[30px] pb-[90px]">
            <p className="text-[#9F9E9E] text-sm cursor-pointer"><Link href="/">Главная</Link> / Личный кабинет / Избранное</p>
            <h2 className="font-semibold my-7.5">Личный кабинет</h2>
            <div className="w-full flex flex-row justify-between gap-15">
                <div className="w-1/5 h-[232px] p-[25px]" style={{border:"1px solid #F3F3F3"}}>
                    <div className="flex flex-col gap-7.5 font-normal">
                        <Link href="/profile/personal"><h4 className="text-[#9F9E9E] cursor-pointer">Личные данные</h4></Link>
                        <Link href="/profile/security"><h4 className="text-[#9F9E9E] cursor-pointer">Безопасность</h4></Link>
                        <Link href="/profile/history"><h4 className="text-[#9F9E9E] cursor-pointer">История заказов</h4></Link>
                        <Link href="/profile/favorites"><h4 className="text-[#1E1E1E] cursor-pointer">Избранное</h4></Link>
                    </div>
                </div>
                <div className="w-4/5 p-[25px] flex flex-col" style={{border:"1px solid #F3F3F3"}}>
                    <h4 className="mb-7.5">Избранное</h4>
                    {loading ? (
                      <p>Загрузка...</p>
                    ) : error ? (
                      <p>{error}</p>
                    ) : (
                      <table className="w-full border-collapse">
                        <thead className="border-b">
                        <tr className="text-lg text-[#1E1E1E]" style={{borderBottom:"1px solid #F3F3F3"}}>
                            <th className="p-3 text-left">Номер</th>
                            <th className="p-3 text-left">Модель</th>
                            <th className="p-3 text-left">Цена</th>
                            <th className="p-3 text-left">В наличии</th>
                            <th className="p-3 text-left">Корзина</th>
                            <th className="p-3 text-left">Kaspi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {favorites.map((item, idx) => (
                            <tr key={idx} className="border-b border-dashed border-[#F3F3F3] last:border-0 hover:bg-gray-50">
                            <td className="p-3">{item.product.code}</td>
                            <td className="p-3 text-[#9F9E9E]">{item.product.product.name}</td>
                            <td className="p-3">{item.product.sale_price}₸</td>
                            <td className="p-3">
                              {item.product.remainings && item.product.remainings.length > 0
                                ? item.product.remainings[0].stock === null
                                  ? "Нет в наличии"
                                  : `В наличие (${item.product.remainings[0].stock})`
                                : "Нет в наличии"}
                            </td>
                            <td className="flex flex-row items-center justify-center gap-1 py-[20px]">
                                <button 
                                    className={`flex border-solid  cursor-pointer w-[25px] h-[25px] items-center justify-center hover:bg-[#08457E] hover:text-white ${copiedIndex === `cart-minus-${idx}` ? 'bg-red-500 text-white' : ''}`}
                                    onClick={async () => {
                                      if (copiedIndex === `cart-minus-${idx}`) return; // блок повторного нажатия
                                      setCopiedIndex(`cart-minus-${idx}`);
                                        await handleAddToCart({
                                          product_id: item.product.remainings[0].variant_id,
                                          store_id: item.product.remainings[0].store.id,
                                          quantity: (cart && cart.items ? cart.items.find(i => i.product_variant.id === item.product.id)?.quantity ?? 0 : 0) - 1
                                          });
                                      setTimeout(() => setCopiedIndex(null), 1000); // задержка между нажатиями
                                    }}
                                    style={{ border: "1px solid #F3F3F3" }}
                                    disabled={
                                      copiedIndex === `cart-plus-${idx}` ||
                                      ((cart && cart.items ? cart.items.find(i => i.product_variant.id ===  item.product.id)?.quantity ?? 0 : 0) >=
                                      item.product.remainings.reduce((total, remaining) => total + remaining.stock, 0))
                                    }
                                >-</button>
                                <span className="text-[16px] w-[25px] h-[25px] flex items-center justify-center text-[#9F9E9E]" style={{border:'1px solid #F3F3F3'}}>
                                    {cart && cart.items ? cart.items.find(i => i.product_variant.id === item.product.id)?.quantity ?? 0 : 0}
                                  </span>
                                  <button
                                    className={`flex border-solid  cursor-pointer w-[25px] h-[25px] items-center justify-center hover:bg-[#08457E] hover:text-white ${copiedIndex === `cart-plus-${idx}` ? 'bg-green-500 text-white' : ''}`}
                                    onClick={async () => {
                                      if (copiedIndex === `cart-plus-${idx}`) return; 
                                      setCopiedIndex(`cart-plus-${idx}`);
                                        await handleAddToCart({
                                          product_id: item.product.remainings[0].variant_id,
                                          store_id: item.product.remainings[0].store.id,
                                          quantity: (cart && cart.items ? cart.items.find(i => i.product_variant.id === item.product.id)?.quantity ?? 0 : 0) + 1
                                          });
                                      setTimeout(() => setCopiedIndex(null), 1000);
                                    }}
                                    style={{ border: "1px solid #F3F3F3" }}
                                    disabled={
                                      copiedIndex === `cart-plus-${idx}` ||
                                      ((cart && cart.items ? cart.items.find(i => i.product_variant.id ===  item.product.id)?.quantity ?? 0 : 0) >=
                                      item.product.remainings.reduce((total, remaining) => total + remaining.stock, 0))
                                    }
                                  >
                                    +
                                  </button>
                            </td>
                            <td>
                                <span className="flex flex-row items-center gap-2 hover:bg-[#E52D36] hover:text-white">
                                    <Image src="/icons/Kaspi.svg" alt="Kaspi" width={19} height={19}/>
                                    <p className="text-[#E52D36]">buy</p>
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}
