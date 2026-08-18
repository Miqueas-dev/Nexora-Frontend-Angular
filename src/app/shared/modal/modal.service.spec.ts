import { ModalService } from './modal.service';

describe('ModalService', () => {
  it('publica un modal de éxito con el texto recibido', () => {
    const service = new ModalService();
    let state;
    service.state$.subscribe(value => state = value);
    service.success('Venta registrada', 'Comprobante guardado');
    expect(state?.visible).toBe(true);
    expect(state?.type).toBe('success');
    expect(state?.title).toBe('Venta registrada');
  });
});
