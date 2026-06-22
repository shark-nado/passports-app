import type { Language } from '../context/AppContext'

type TranslationMap = Record<string, string>
type Translations = Record<Language, TranslationMap>

const translations: Translations = {
  en: {
    'site.name': 'UC San Diego Passports',
    'site.short': 'Passports',

    'location.select.title': 'Select Location',
    'location.csc': 'CSC',
    'location.bookstore': 'Bookstore',
    'checkin.at': 'Check-In @ {location}',
    'dashboard.link': 'Employee Dashboard',
    'dashboard.login': 'Dashboard Login',
    'dashboard.lock': 'Lock Dashboard',

    'kiosk.welcome': 'UC San Diego Passports',
    'kiosk.subwelcome': 'Please check in to get started',
    'kiosk.start': 'Start',

    'step1.title': 'Select Visit Type',
    'step1.appointment': 'Appointment',
    'step1.walkin': 'Walk-In',
    'step1.returning': 'Questions / Returning',

    'step2.title': 'Enter Your Contact Information',
    'step2.firstName': 'First Name',
    'step2.lastName': 'Last Name',
    'step2.email': 'Email Address',
    'step2.phone': 'Phone Number',
    'step2.subscribe': 'Subscribe to UC San Diego Passports newsletter & updates',

    'service.title': 'What service do you need today?',
    'service.passports': 'Passport',
    'service.notary': 'Notary',
    'service.photoOnly': 'Photo Only',

    'photo.format.title': 'What type of photo do you need?',
    'photo.digital': 'Digital',
    'photo.both': 'Both',
    'photo.printed': 'Printed',

    'step3.title': 'Document & Fee Verification',
    'step3.desc': 'Flagging missing items now saves you time at the counter.',
    'step3.appComplete': 'Is your passport application complete?',

    'yes': 'Yes',
    'no': 'No',
    'back': 'Back',
    'next': 'Next',
    'submit': 'Complete Check-In',

    'success.title': 'Check-In Complete!',
    'success.desc': 'Thank you, {name}. Please take a seat. We will call you shortly.',
    'incomplete.thankYou': 'Thank you, {name}.',
    'incomplete.action': 'Please fill out a form and inform an agent when completed.',
    'redirecting': 'This screen will reset in {seconds} seconds.',

    'required.fields': 'Please fill in all required fields.',
    'select.service': 'Please select a service to continue.',
    'invalid.phone': 'Please enter a valid 10-digit phone number.',
    'invalid.email': 'That email doesn\'t look valid.',
    'select.photoFormat': 'Please choose a photo type.',
    'confirm.appComplete': 'Please answer whether your passport application is complete.',
    'confirm.checklist': 'Please confirm all document check questions before submitting.',
  },

  es: {
    'site.name': 'UC San Diego Passports',
    'site.short': 'Passports',

    'kiosk.welcome': 'UC San Diego Passports',
    'kiosk.subwelcome': 'Por favor regístrese para comenzar',
    'kiosk.start': 'Comenzar',

    'step1.title': 'Seleccione el Tipo de Visita',
    'step1.appointment': 'Cita',
    'step1.walkin': 'Sin Cita (Walk-In)',
    'step1.returning': 'Preguntas / Regreso',

    'step2.title': 'Ingrese su Información de Contacto',
    'step2.firstName': 'Nombre',
    'step2.lastName': 'Apellido',
    'step2.email': 'Correo Electrónico',
    'step2.phone': 'Número de Teléfono',
    'step2.subscribe': 'Suscríbase al boletín y novedades de UC San Diego Passports',

    'service.title': '¿Qué servicio necesita hoy?',
    'service.passports': 'Pasaporte',
    'service.notary': 'Notario',
    'service.photoOnly': 'Solo Foto',

    'photo.format.title': '¿Qué tipo de foto necesita?',
    'photo.digital': 'Digital',
    'photo.both': 'Ambas',
    'photo.printed': 'Impresa',

    'step3.title': 'Verificación de Documentos y Pagos',
    'step3.desc': 'Identificar documentos faltantes ahora le ahorrará tiempo en la ventanilla.',
    'step3.appComplete': '¿Está completa su solicitud de pasaporte?',

    'yes': 'Sí',
    'no': 'No',
    'back': 'Atrás',
    'next': 'Siguiente',
    'submit': 'Completar Registro',

    'success.title': '¡Registro Completado!',
    'success.desc': 'Gracias, {name}. Por favor tome asiento. Le llamaremos en breve.',
    'incomplete.thankYou': 'Gracias, {name}.',
    'incomplete.action': 'Por favor complete un formulario e informe a un agente cuando termine.',
    'redirecting': 'Esta pantalla se reiniciará en {seconds} segundos.',

    'required.fields': 'Por favor complete todos los campos obligatorios.',
    'select.service': 'Por favor seleccione un servicio para continuar.',
  },

  zh: {
    'site.name': 'UC San Diego Passports',
    'site.short': 'Passports',

    'kiosk.welcome': 'UC San Diego Passports',
    'kiosk.subwelcome': '请登记以开始办理',
    'kiosk.start': '开始',

    'step1.title': '选择来访类型',
    'step1.appointment': '预约',
    'step1.walkin': '无预约 (Walk-In)',
    'step1.returning': '咨询 / 返回办理',

    'step2.title': '输入您的联系信息',
    'step2.firstName': '名',
    'step2.lastName': '姓',
    'step2.email': '电子邮件',
    'step2.phone': '电话号码',
    'step2.subscribe': '订阅 UC San Diego 护照服务的新闻与更新',

    'service.title': '您今天需要哪项服务？',
    'service.passports': '护照',
    'service.notary': '公证',
    'service.photoOnly': '仅拍照',

    'photo.format.title': '您需要哪种照片？',
    'photo.digital': '电子版',
    'photo.both': '两者都要',
    'photo.printed': '纸质版',

    'step3.title': '材料与费用核对',
    'step3.desc': '立即标记缺失的材料可以节省您在柜台的办理时间。',
    'step3.appComplete': '您的护照申请表填写完整了吗？',

    'yes': '是',
    'no': '否',
    'back': '返回',
    'next': '下一步',
    'submit': '完成登记',

    'success.title': '登记完成！',
    'success.desc': '谢谢您，{name}。请坐，我们很快会叫您的名字。',
    'incomplete.thankYou': '谢谢您，{name}。',
    'incomplete.action': '请填写表格，完成后通知工作人员。',
    'redirecting': '屏幕将在 {seconds} 秒内重置。',

    'required.fields': '请填写所有必填字段。',
    'select.service': '请选择一项服务以继续。',
  },

  vi: {
    'site.name': 'UC San Diego Passports',
    'site.short': 'Passports',

    'kiosk.welcome': 'UC San Diego Passports',
    'kiosk.subwelcome': 'Vui lòng đăng ký để bắt đầu',
    'kiosk.start': 'Bắt đầu',

    'step1.title': 'Chọn Loại Hình Đến',
    'step1.appointment': 'Lịch hẹn',
    'step1.walkin': 'Khách vãng lai (Walk-In)',
    'step1.returning': 'Câu hỏi / Quay lại',

    'step2.title': 'Nhập Thông tin Liên hệ',
    'step2.firstName': 'Tên',
    'step2.lastName': 'Họ',
    'step2.email': 'Địa chỉ Email',
    'step2.phone': 'Số Điện thoại',
    'step2.subscribe': 'Đăng ký nhận bản tin & cập nhật từ UC San Diego Passports',

    'service.title': 'Bạn cần dịch vụ nào hôm nay?',
    'service.passports': 'Hộ chiếu',
    'service.notary': 'Công chứng',
    'service.photoOnly': 'Chỉ chụp ảnh',

    'photo.format.title': 'Bạn cần loại ảnh nào?',
    'photo.digital': 'Kỹ thuật số',
    'photo.both': 'Cả hai',
    'photo.printed': 'Bản in',

    'step3.title': 'Xác minh Tài liệu & Lệ phí',
    'step3.desc': 'Báo trước các giấy tờ còn thiếu giúp tiết kiệm thời gian cho bạn tại quầy.',
    'step3.appComplete': 'Đơn xin hộ chiếu của bạn đã hoàn tất chưa?',

    'yes': 'Có',
    'no': 'Không',
    'back': 'Quay lại',
    'next': 'Tiếp tục',
    'submit': 'Hoàn tất Đăng ký',

    'success.title': 'Đăng Ký Hoàn Tất!',
    'success.desc': 'Cảm ơn {name}. Vui lòng chọn chỗ ngồi. Chúng tôi sẽ gọi bạn sớm.',
    'incomplete.thankYou': 'Cảm ơn {name}.',
    'incomplete.action': 'Vui lòng điền vào mẫu đơn và thông báo cho nhân viên khi hoàn tất.',
    'redirecting': 'Màn hình sẽ tự động thiết lập lại sau {seconds} giây.',

    'required.fields': 'Vui lòng điền đầy đủ các thông tin bắt buộc.',
    'select.service': 'Vui lòng chọn một dịch vụ để tiếp tục.',
  },
}

export function t(key: string, vars?: Record<string, string | number>, lang?: Language): string {
  const l = lang || 'en'
  let text = translations[l]?.[key] || translations.en[key] || key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v))
    }
  }
  return text
}

export { translations }
export type { Language, Translations }
