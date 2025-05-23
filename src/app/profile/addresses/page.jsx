"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCustomerAddress,
  deleteCustomerAddress,
  getCustomerProfile,
  updateCustomerAddress,
} from "@/store/authSlice";
import { Plus, Trash, Pencil, Home, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddressesPage() {
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    label: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "Türkiye",
  });

  useEffect(() => {
    dispatch(getCustomerProfile());
  }, [dispatch]);

  const openModal = (address = null) => {
    setEditMode(!!address);
    setCurrent(address);
    setForm(
      address || {
        label: "",
        line1: "",
        city: "",
        postalCode: "",
        country: "Türkiye",
      }
    );
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode && current?._id) {
      dispatch(updateCustomerAddress({ id: current._id, data: form }))
        .unwrap()
        .then(() => {
          toast.success("Adres güncellendi");
          setModalOpen(false);
        });
    } else {
      dispatch(addCustomerAddress(form))
        .unwrap()
        .then(() => {
          toast.success("Adres eklendi");
          setModalOpen(false);
        });
    }
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCustomerAddress(deleteId))
      .unwrap()
      .then(() => {
        toast.success("Adres silindi");
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Adreslerim</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Yeni Adres
        </button>
      </div>

      <div className="space-y-4">
        {customer?.addresses?.map((addr) => (
          <div
            key={addr._id}
            className="p-4 bg-white rounded-xl border flex justify-between items-start gap-4"
          >
            <div>
              <p className="text-sm font-semibold text-gray-700">
                <Home className="inline mr-1 w-4 h-4" /> {addr.label}
              </p>
              <p className="text-sm text-gray-600">{addr.line1}</p>
              <p className="text-sm text-gray-600">
                {addr.postalCode} {addr.city}, {addr.country}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openModal(addr)}
                className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteConfirm(addr._id)}
                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Adres Ekle/Düzenle Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-primary">
              {editMode ? "Adresi Düzenle" : "Yeni Adres"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="label"
                placeholder="Etiket (Ev, İş vb.)"
                value={form.label}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="line1"
                placeholder="Adres satırı"
                value={form.line1}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="city"
                placeholder="Şehir"
                value={form.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Posta Kodu"
                value={form.postalCode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <button
                type="submit"
                className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
              >
                {editMode ? "Güncelle" : "Ekle"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl text-center space-y-4">
            <p className="text-lg font-medium text-gray-800">
              Bu adresi silmek istediğinize emin misiniz?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Vazgeç
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
